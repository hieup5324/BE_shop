import { Module } from '@nestjs/common';
import { GoogleService } from './services/google.service';
import { GoogleController } from './controllers/google.controller';
import { GoogleStrategy } from './Strategies/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/userEntity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [GoogleService, GoogleStrategy, UserRepository],
  controllers: [GoogleController],
})
export class GoogleModule {}
