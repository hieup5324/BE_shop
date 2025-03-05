import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderItemEntity } from './entity/order-item.entity';
import { OrderRepository } from './order.repository';
import { UserModule } from '../users/user.module';
import { OrderItemRepository } from './orderItem.repository';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    UserModule,
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderItemRepository],
  exports: [OrderService, OrderRepository, OrderItemRepository],
})
export class OrderModule {}
