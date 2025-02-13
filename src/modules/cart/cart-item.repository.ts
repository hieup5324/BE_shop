import { Repository } from 'typeorm';
import { CartEntity } from './entity/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemEntity } from './entity/cart-item.entity';

export class CartItemRepository extends Repository<CartItemEntity> {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartItemRepo: Repository<CartItemEntity>,
  ) {
    super(cartItemRepo.target, cartItemRepo.manager, cartItemRepo.queryRunner);
  }
}
