import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/categories.entity';
import { CategoryController } from './categoies.controller';
import { CategoryService } from './categoies.service';
import { UserService } from '../users/user.service';
import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/userEntity/user.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity]), UserModule],
  controllers: [CategoryController],
  providers: [CategoryService, UserRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
