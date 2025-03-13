import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from 'src/modules/orders/order.module';
import { VnPayController } from './VnPayController.controller';
import { VnPayService } from './VnPayService.service';
import { VNpayRepository } from './vnpay.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VnPayTransactionEntity } from './entity/vn_pay_transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VnPayTransactionEntity]),
    ConfigModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [VnPayController],
  providers: [VnPayService, VNpayRepository],
  exports: [VnPayService, VNpayRepository],
})
export class VnPayModule {}
