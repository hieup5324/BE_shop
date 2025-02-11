import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/userEntity/user.entity';
import { CategoryEntity } from './entity/categories.entity';
import { createCategoryDto } from './categoriesDTO/create-category.dto';
import { updateCategoryDto } from './categoriesDTO/update-category.dto';
import { CategoryRepository } from './categories.repository';
import { CategoryQuery } from './categoriesDTO/categories.query';
import { ProductService } from '../products/product.service';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async create(requestBody: createCategoryDto, currentUser: UserEntity) {
    const category = await this.categoryRepo.create(requestBody);
    category.users = currentUser;
    return this.categoryRepo.save(category);
  }

  getAll() {
    return this.categoryRepo.find();
  }

  async getCategoryWithProduct(query: CategoryQuery) {
    const { search, page, page_size, product } = query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(page_size) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const category = await this.categoryRepo.findOne({
      where: { id: search },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const { products, total } = await this.productService.getProductsByCategory(
      search,
      product,
      skip,
      pageSize,
    );
    return {
      data: products,
      paging: {
        total,
        page: pageNumber,
        page_size: pageSize,
        total_pages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const category = await this.categoryRepo.findOneBy(option);
    return category;
  }

  async findOne(id: number) {
    return await this.categoryRepo.findOneBy({ id });
  }
  async findById(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: id },
      relations: { users: true },
    });
    if (!category) {
      throw new NotFoundException('danh mục không tồn tại');
    }
    return category;
  }

  async updateById(
    id: number,
    requestBody: updateCategoryDto,
    currentUser: UserEntity,
  ) {
    let product = await this.findOneByOption({
      id: id,
      user_id: currentUser.id,
    });

    if (!product) {
      throw new NotFoundException('không có danh muc nay');
    }

    product = { ...product, ...requestBody };

    const updateProduct = this.categoryRepo.save(product);
    return updateProduct;
  }

  async deleteCategory(id: number, currentUser: UserEntity) {
    let category = await this.findOneByOption({
      id: id,
      user_id: currentUser.id,
    });
    if (!category) {
      throw new NotFoundException('không có danh muc này');
    }
    return this.categoryRepo.remove(category);
  }
}
