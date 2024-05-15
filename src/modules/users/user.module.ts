import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './userEntity/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumers/email.consumer';
import { CategoryEntity } from '../categories/entity/categories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CategoryEntity]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, UserRepository, EmailConsumer],
  exports: [UserService, AuthService, UserRepository],
})
export class UserModule {}
