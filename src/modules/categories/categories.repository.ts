import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/categories.entity';

export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepo: Repository<CategoryEntity>,
  ) {
    super(
      categoriesRepo.target,
      categoriesRepo.manager,
      categoriesRepo.queryRunner,
    );
  }

  async getCategories(search: string): Promise<any> {
    const queryBuilder = this.createQueryBuilder('category');

    if (search) {
      queryBuilder.andWhere('category.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }
}
