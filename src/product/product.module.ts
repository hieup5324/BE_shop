import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { UserService } from 'src/user/user.service';
import { UserGroupEntity } from 'src/user/userEntity/user-group.entity';
import { GroupEntity } from 'src/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      UserEntity,
      GroupEntity,
      UserGroupEntity,
    ]),
  ],
  providers: [ProductService, UserService],
  controllers: [ProductController],
})
export class ProductModule {}
