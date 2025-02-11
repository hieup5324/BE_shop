import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/categories.entity';
import { CategoryController } from './categoies.controller';
import { CategoryService } from './categoies.service';
import { UserService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/userEntity/user.entity';
import { UserModule } from '../users/user.module';
import { CategoryRepository } from './categories.repository';
import { ProductModule } from '../products/product.module';
import { ProductEntity } from '../products/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, UserEntity]),
    UserModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, UserRepository, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
