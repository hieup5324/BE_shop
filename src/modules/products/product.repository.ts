import { Repository } from 'typeorm';
import { ProductEntity } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductQuery } from './productDTO/product.query';

export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {
    super(productRepo.target, productRepo.manager, productRepo.queryRunner);
  }

  async getProducts(query: ProductQuery): Promise<any> {
    let { search, page, page_size } = query;

    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('products');

    if (search) {
      queryBuilder.andWhere('products.product_name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
