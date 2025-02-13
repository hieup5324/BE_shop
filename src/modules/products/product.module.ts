import { Module, forwardRef } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { CategoryModule } from '../categories/categoies.module';
import { OrderModule } from '../orders/order.module';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserEntity } from '../users/userEntity/user.entity';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UserEntity]),
    CategoryModule,
  ],
  providers: [ProductService, UserService, UserRepository, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
