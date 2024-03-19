import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { GroupEntity } from '../group/group.entity';
import { UserGroupEntity } from '../users/userEntity/user-group.entity';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserEntity } from '../users/userEntity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      UserEntity,
      GroupEntity,
      UserGroupEntity,
    ]),
  ],
  providers: [ProductService, UserService, UserRepository],
  controllers: [ProductController],
})
export class ProductModule {}
