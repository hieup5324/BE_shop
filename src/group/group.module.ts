import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { UserService } from 'src/user/user.service';
import { UserGroupEntity } from 'src/user/userEntity/user-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity, UserEntity, UserGroupEntity]),
  ],
  providers: [GroupService, UserService],
  controllers: [GroupController],
})
export class GroupModule {}
