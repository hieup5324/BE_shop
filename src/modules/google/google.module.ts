import { Module } from '@nestjs/common';
import { GoogleService } from './services/google.service';
import { GoogleController } from './controllers/google.controller';
import { GoogleStrategy } from './Strategies/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { UserEntity } from '../users/userEntity/user.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CartModule],
  providers: [GoogleService, GoogleStrategy, UserRepository],
  controllers: [GoogleController],
})
export class GoogleModule {}
