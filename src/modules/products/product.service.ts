import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { ProductEntity } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createProductDto } from './productDTO/createProduct.dto';

import { updateProductDto } from './productDTO/updateProduct.dto';
import { UserEntity } from '../users/userEntity/user.entity';
import { CategoryService } from '../categories/categoies.service';
import { OrderStatus } from '../orders/enum/order-status.enum';
import dataSource from 'db/data-source';
import { OrderService } from '../orders/order.service';
import { ProductRepository } from './product.repository';
import { ProductQuery } from './productDTO/product.query';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async create(
    requestBody: createProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +requestBody.categoryId,
    );
    const product = this.productRepo.create(requestBody);
    product.categories = category;
    product.users = currentUser;
    return this.productRepo.save(product);
  }

  // async getAll(query: any): Promise<{ products: any[]; totalProducts; limit }> {
  //   console.log(query);
  //   let filteredTotalProducts: number;
  //   let limit: number;

  //   if (!query.limit) {
  //     limit = 5;
  //   } else {
  //     limit = query.limit;
  //   }

  //   const queryBuilder = dataSource
  //     .getRepository(ProductEntity)
  //     .createQueryBuilder('product')
  //     .leftJoinAndSelect('product.categories', 'category')
  //     .groupBy('product.id,category.id');

  //   const totalProducts = await queryBuilder.getCount();

  //   if (query.search) {
  //     const search = query.search;
  //     queryBuilder.andWhere('product.nameProduct like :nameProduct', {
  //       nameProduct: `%${search}%`,
  //     });
  //   }
  //   if (query.category) {
  //     const category = query.category;
  //     queryBuilder.andWhere('category.title  like :title', {
  //       title: `%${category}%`,
  //     });
  //   }
  //   if (query.minPrice) {
  //     queryBuilder.andWhere('product.price>=:minPrice', {
  //       minPrice: query.minPrice,
  //     });
  //   }
  //   if (query.maxPrice) {
  //     queryBuilder.andWhere('product.price<=:maxPrice', {
  //       maxPrice: query.maxPrice,
  //     });
  //   }

  //   queryBuilder.limit(limit);

  //   if (query.offset) {
  //     queryBuilder.offset(query.offset);
  //   }

  //   const products = await queryBuilder.getRawMany();

  //   return { products, totalProducts, limit };
  // }

  async getProducts(query: ProductQuery): Promise<any> {
    return await this.productRepo.getProducts(query);
  }

  async getProductsByCategory(
    categoryId: string,
    productName: string,
    skip: number,
    take: number,
  ) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .skip(skip)
      .take(take);

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (productName) {
      queryBuilder.andWhere('product.productName LIKE :productName', {
        productName: `%${productName}%`,
      });
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: {
        users: true,
        categories: true,
      },
      select: {
        users: {
          id: true,
          email: true,
        },
        categories: {
          id: true,
          name: true,
        },
      },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm.');
    return product;
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const product = await this.productRepo.findOneBy(option);
    return product;
  }

  async findById(id: number) {
    const product = await this.productRepo.findOne({
      where: { id: id },
      relations: {
        categories: true,
        users: true,
      },
    });
    if (!product) {
      throw new NotFoundException('sản phẩm không tồn tại');
    }
    return product;
  }

  async updateById(
    id: number,
    requestBody: updateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    let product = await this.findById(id);
    if (!product) {
      throw new NotFoundException('không có sản phẩm này');
    }
    if (requestBody.categoryId) {
      const category = await this.categoryService.findOne(
        +requestBody.categoryId,
      );
      product.categories = category;
    }
    product.users = currentUser;

    product = { ...product, ...requestBody };

    const updateProduct = this.productRepo.save(product);
    return updateProduct;
  }

  // async updateStock(id: number, stock: number, status: string) {
  //   let product = await this.findById(id);
  //   if (status === OrderStatus.DELIVERED) {
  //     product.stock -= stock;
  //   } else {
  //     product.stock += stock;
  //   }
  //   product = await this.productRepo.save(product);
  //   return product;
  // }

  async deleteProduct(id: number) {
    const product = await this.findOne(id);
    const order = await this.orderService.findOneByProductId(product.id);
    if (order) throw new BadRequestException('Sản phẩm đang được sử dụng.');
    return await this.productRepo.remove(product);
  }
}
