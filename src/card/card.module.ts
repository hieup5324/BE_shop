import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { CardController } from './card.controller';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { GroupEntity } from 'src/group/group.entity';
import { UserGroupEntity } from 'src/user/userEntity/user-group.entity';
import { UserRepository } from 'src/user/user.repository';

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
