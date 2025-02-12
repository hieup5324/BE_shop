import { Repository } from 'typeorm';
import { CartEntity } from './entity/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class CartRepository extends Repository<CartEntity> {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepo: Repository<CartEntity>,
  ) {
    super(cartRepo.target, cartRepo.manager, cartRepo.queryRunner);
  }
}
