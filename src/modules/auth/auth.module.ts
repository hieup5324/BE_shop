import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CartRepository } from '../cart/cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../cart/entity/cart.entity';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CartRepository],
  exports: [AuthService],
})
export class AuthModule {}
