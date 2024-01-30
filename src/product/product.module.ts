import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity, UserEntity])],
  providers: [ProductService,UserService],
  controllers: [ProductController],
})
export class ProductModule {}
