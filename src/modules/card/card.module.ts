import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from '../group/group.entity';

import { CardController } from './card.controller';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { UserRepository } from '../users/user.repository';
import { UserService } from '../users/user.service';
import { UserGroupEntity } from '../users/userEntity/user-group.entity';
import { UserEntity } from '../users/userEntity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CardEntity,
      UserEntity,
      UserRepository,
      GroupEntity,
      UserGroupEntity,
    ]),
  ],
  providers: [CardService, UserService, UserRepository],
  controllers: [CardController],
})
export class CardModule {}
