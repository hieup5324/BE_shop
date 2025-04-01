import {
  ForbiddenException,
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
import { query } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async create(requestBody: createCategoryDto, currentUser: UserEntity) {
    const { name } = requestBody;
    const cateExits = await this.findOneByOption({ name });
    if (cateExits) {
      throw new ForbiddenException('Danh mục đã tồn tại');
    }
    const category = this.categoryRepo.create(requestBody);
    category.user = currentUser;
    return this.categoryRepo.save(category);
  }

  async getAll(query: CategoryQuery) {
    return await this.categoryRepo.getAllCategories(query);
  }

  async getCategoryWithProduct(query: CategoryQuery) {
    const { search, page, page_size, category } = query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(page_size) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const categoryDB = await this.categoryRepo.findOne({
      where: { id: category },
    });
    if (!categoryDB) {
      throw new Error('Category not found');
    }

    const { products, total } = await this.productService.getProductsByCategory(
      category,
      search,
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
      relations: { user: true },
    });
    if (!category) {
      throw new NotFoundException('danh mục không tồn tại');
    }
    return category;
  }

  async updateById(id: number, requestBody: updateCategoryDto) {
    let category = await this.findOneByOption({
      id: id,
    });

    if (!category) {
      throw new NotFoundException('không có danh muc nay');
    }

    category = { ...category, ...requestBody };

    this.categoryRepo.save(category);
    return {
      message: 'Cập nhật danh mục thành công',
    };
  }

  async deleteCategory(id: number) {
    let category = await this.findOneByOption({
      id,
    });
    if (!category) {
      throw new NotFoundException('không có danh mục này');
    }
    await this.categoryRepo.remove(category);
    return {
      message: 'Xóa danh mục thành công',
    };
  }
}
