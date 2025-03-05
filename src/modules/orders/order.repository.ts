import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';

export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {
    super(orderRepo.target, orderRepo.manager, orderRepo.queryRunner);
  }
}
