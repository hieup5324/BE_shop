import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticController } from './statistics.controller';
import { StatisticService } from './statistics.service';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [OrderModule],
  providers: [StatisticService],
  controllers: [StatisticController],
  exports: [StatisticService],
})
export class StatisticModule {}
