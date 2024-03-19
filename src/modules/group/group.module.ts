import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserGroupEntity } from '../users/userEntity/user-group.entity';
import { UserEntity } from '../users/userEntity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupEntity,
      UserRepository,
      UserGroupEntity,
      UserEntity,
    ]),
  ],
  providers: [GroupService, UserService, UserRepository],
  controllers: [GroupController],
})
export class GroupModule {}
