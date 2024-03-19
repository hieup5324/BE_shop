import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../group/group.entity';
import { UserGroupEntity } from '../users/userEntity/user-group.entity';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserEntity } from '../users/userEntity/user.entity';
import { CategoryEntity } from './entity/categories.entity';
import { CategoryController } from './categoies.controller';
import { CategoryService } from './categoies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      UserEntity,
      GroupEntity,
      UserGroupEntity,
    ]),
  ],
  providers: [CategoryService, UserService, UserRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
