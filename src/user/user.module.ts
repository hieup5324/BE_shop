import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './userEntity/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserGroupEntity } from './userEntity/user-group.entity';
import { GroupEntity } from 'src/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GroupEntity, UserGroupEntity]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],

  providers: [UserService, AuthService],
})
export class UserModule {}
