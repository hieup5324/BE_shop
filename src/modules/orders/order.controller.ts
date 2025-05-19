import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orderDTO/createOrder.dto';
import { OrderQuery } from './orderDTO/orders.query';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserOrders(@Request() req) {
    return this.orderService.getUserOrders(req.currentUser.id);
  }

  @Get('test')
  @UseGuards(AuthGuard)
  async getUserOrdersV2(@Request() req, @Query() query: OrderQuery) {
    return await this.orderService.getUserOrdersV2(req.currentUser.id, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req.currentUser.id, dto);
  }

  @Post('webhook')
  async updateOrderStatus(@Body() statusUpdate: any) {
    this.orderService.updateOrderV2(statusUpdate);
    return { success: true, message: 'Webhook received' };
  }
}
