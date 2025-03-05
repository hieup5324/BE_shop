import { Controller, Get, Query, Param, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from 'src/modules/orders/order.service';
import { VnPayService } from './VnPayService.service';
import { ORDER_STATUS } from '../shared/constants/common';

@Controller('vnpay')
export class VnPayController {
  constructor(
    private readonly vnPayService: VnPayService,
    private readonly orderService: OrderService,
  ) {}

  @Post('create-payment/:orderId')
  async createPayment(@Param('orderId') orderId: number) {
    const order = await this.orderService.findOrderById(orderId);
    if (!order) {
      return { message: 'Không tìm thấy đơn hàng', status: 'error' };
    }
    return this.vnPayService.createVNPayLink(order);
  }

  @Get('return')
  async handleReturn(@Query() query: any) {
    console.log('🔹 VNPay Return Query:', query);

    const isValid = this.vnPayService.verifyPayment(query);
    if (!isValid) {
      console.log('❌ VNPay Payment Verification Failed');
      return { message: 'Giao dịch không hợp lệ', status: 'error' };
    }

    const orderId = Number(query.vnp_TxnRef);
    const status =
      query.vnp_ResponseCode === '00'
        ? ORDER_STATUS.DELIVERED
        : ORDER_STATUS.CANCELLED;

    console.log(`✅ Payment Status for Order ${orderId}:`, status);
    console.log(`✅ VNPay Response Code: ${query.vnp_ResponseCode}`);

    await this.orderService.updateOrderStatus(orderId, status);

    return { message: 'Thanh toán thành công', status: 'success' };
  }

  @Post('ipn')
  async handleIPN(@Body() body: any) {
    console.log('VNPay IPN Body:', body);
    const isValid = this.vnPayService.verifyPayment(body);
    if (!isValid) {
      return { message: 'Giao dịch không hợp lệ', status: 'error' };
    }

    const orderId = Number(body.vnp_TxnRef);
    const status =
      body.vnp_ResponseCode === '00'
        ? ORDER_STATUS.DELIVERED
        : ORDER_STATUS.CANCELLED;

    await this.orderService.updateOrderStatus(orderId, status);

    return {
      message: 'Cập nhật trạng thái thanh toán thành công',
      status: 'success',
    };
  }
}
