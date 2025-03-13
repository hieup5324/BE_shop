import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { query, Request } from 'express';
import { OrderService } from 'src/modules/orders/order.service';
import { VnPayService } from './VnPayService.service';
import { ORDER_STATUS } from '../shared/constants/common';

@Controller('vnpay')
export class VnPayController {
  constructor(
    private readonly vnPayService: VnPayService,
    private readonly orderService: OrderService,
  ) {}

  @Get('return')
  async handleReturn(@Query() query: any, @Res() res: any) {
    const isValid = this.vnPayService.verifyPayment(query);
    if (!isValid) {
      return { message: 'Giao dịch không hợp lệ', status: 'error' };
    }
    return await this.orderService.updateOrderStatus(query, res);
  }

  @Post('create-payment/:orderId')
  async createPayment(@Param('orderId') orderId: number) {
    const order = await this.orderService.findOrderById(orderId);
    if (!order) {
      return { message: 'Không tìm thấy đơn hàng', status: 'error' };
    }
    return this.vnPayService.createVNPayLink(order);
  }

  @Get('/:id')
  async getTransactionById(@Param('id') id: string) {
    return await this.vnPayService.getTransactionById(id);
  }

  // @Post('ipn')
  // async handleIPN(@Body() query: any) {
  //   const isValid = this.vnPayService.verifyPayment(query);
  //   if (!isValid) {
  //     return { message: 'Giao dịch không hợp lệ', status: 'error' };
  //   }
  //   await this.orderService.updateOrderStatus(query);
  //   return {
  //     message: 'Cập nhật trạng thái thanh toán thành công',
  //     status: 'success',
  //   };
  // }
}
