import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderItemEntity } from './entity/order-item.entity';

export class OrderItemRepository extends Repository<OrderItemEntity> {
  constructor(
    @InjectRepository(OrderItemEntity)
    private orderItemRepo: Repository<OrderItemEntity>,
  ) {
    super(
      orderItemRepo.target,
      orderItemRepo.manager,
      orderItemRepo.queryRunner,
    );
  }
}
