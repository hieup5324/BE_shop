import { Injectable } from '@nestjs/common';
import { OrderService } from '../orders/order.service';
import { StatisticQuery } from './dto/statistic.query';

@Injectable()
export class StatisticService {
  constructor(private readonly orderService: OrderService) {}

  async getOverView() {
    const { totalRevenue, totalOrdersCompleted } =
      await this.orderService.getTotalRevenue();

    return {
      totalRevenue,
      totalOrdersCompleted,
    };
  }

  async getAllOderRevenen(query: StatisticQuery) {
    return await this.orderService.getAllOderRevenen(query);
  }
}
