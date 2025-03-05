import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from 'src/modules/orders/order.module';
import { VnPayController } from './VnPayController.controller';
import { VnPayService } from './VnPayService.service';
import { VNpayRepository } from './vnpay.repository';

@Module({
  imports: [ConfigModule, OrderModule],
  controllers: [VnPayController],
  providers: [VnPayService],
  exports: [VnPayService],
})
export class VnPayModule {}
