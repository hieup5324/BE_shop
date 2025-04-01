import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/categories.entity';
import { CategoryQuery } from './categoriesDTO/categories.query';

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

  async getAllCategories(query: CategoryQuery): Promise<any> {
    let { search, page, page_size } = query;

    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('categories');

    if (search) {
      queryBuilder.andWhere('categories.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);

    const [categoies, total] = await queryBuilder.getManyAndCount();

    return {
      data: categoies,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
