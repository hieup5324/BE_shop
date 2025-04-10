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
    let { search, page, page_size, price, categoryId } = query;

    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('products')
      .where('products.quantity > 0');

    if (search) {
      queryBuilder.andWhere('products.product_name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      queryBuilder.andWhere('products.category_id = :categoryId', {
        categoryId,
      });
    }

    if (price) {
      if (price === 'asc') {
        queryBuilder.orderBy('products.price', 'ASC');
      } else {
        queryBuilder.orderBy('products.price', 'DESC');
      }
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
