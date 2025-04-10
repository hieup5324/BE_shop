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
import dataSource from 'db/data-source';
import { OrderService } from '../orders/order.service';
import { ProductRepository } from './product.repository';
import { ProductQuery } from './productDTO/product.query';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryService: CategoryService,
    // @Inject(forwardRef(() => OrderService))
    // private readonly orderService: OrderService,
  ) {}

  async create(
    requestBody: createProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      +requestBody.categoryId,
    );
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = this.productRepo.create(requestBody);
    product.category = category;
    product.user = currentUser;

    return this.productRepo.save(product);
  }

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
      .leftJoinAndSelect('product.category', 'category')
      .skip(skip)
      .take(take);

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    if (productName) {
      queryBuilder.andWhere('product.product_name LIKE :productName', {
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
        user: true,
        category: true,
      },
      select: {
        user: {
          id: true,
          email: true,
        },
        category: {
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
      where: { id },
      relations: {
        category: true,
        user: true,
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
      product.category = category;
    }
    product.user = currentUser;

    product = { ...product, ...requestBody };

    const updateProduct = this.productRepo.save(product);
    return updateProduct;
  }

  async updateQuantity(
    id: number,
    quantity: number,
    action: 'increase' | 'decrease',
  ): Promise<ProductEntity> {
    const product = await this.findById(id);

    if (action === 'decrease') {
      if (product.quantity < quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.product_name} không đủ số lượng trong kho`,
        );
      }
      product.quantity -= quantity;
    } else {
      product.quantity += quantity;
    }

    return this.productRepo.save(product);
  }
}
