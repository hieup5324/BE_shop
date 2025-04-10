import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CartRepository } from '../cart/cart.repository';
import { CartService } from './cart.service';
import { CartEntity } from './entity/cart.entity';
import { CartController } from './cart.controller';
import { UserModule } from '../users/user.module';
import { CartItemRepository } from './cart-item.repository';
import { ProductModule } from '../products/product.module';
import { CartItemEntity } from './entity/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
    UserModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository, CartItemRepository],
  exports: [CartService, CartRepository, CartItemRepository],
})
export class CartModule {}
