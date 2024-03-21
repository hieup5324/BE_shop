import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrdersProductsEntity } from './entity/order-product.entity';
import { ShippingEntity } from './entity/shipping.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../products/product.module';
import { UserEntity } from '../users/userEntity/user.entity';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrdersProductsEntity,
      ShippingEntity,
      UserEntity,
    ]),
    forwardRef(() => ProductModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, UserService, UserRepository],
  exports: [OrderService],
})
export class OrderModule {}
