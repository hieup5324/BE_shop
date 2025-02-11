import { Repository } from 'typeorm';
import { ProductEntity } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {
    super(productRepo.target, productRepo.manager, productRepo.queryRunner);
  }

  async getProducts(search: string): Promise<any> {
    const queryBuilder = this.createQueryBuilder('products');

    if (search) {
      queryBuilder.andWhere('products.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }
}
