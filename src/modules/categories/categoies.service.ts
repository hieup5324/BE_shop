import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/userEntity/user.entity';
import { CategoryEntity } from './entity/categories.entity';
import { createCategoryDto } from './categoriesDTO/createCategory.dto';
import { updateCategoryDto } from './categoriesDTO/updateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async create(requestBody: createCategoryDto, currentUser: UserEntity) {
    const category = await this.categoryRepo.create(requestBody);
    category.user = currentUser;
    return this.categoryRepo.save(category);
  }

  getAll() {
    return this.categoryRepo.find();
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const category = await this.categoryRepo.findOneBy(option);
    return category;
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
