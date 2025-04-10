import { Body, Controller, Get, Post } from '@nestjs/common';
import { GHNService } from './GHN.service';
import { GHNCalculateFeeDto } from './dto/caculator-fee.dto';

@Controller('ghn')
export class GHNController {
  constructor(private readonly ghnService: GHNService) {}

  // @Post()
  // async createOrderB(@Body() order: any) {
  //   try {
  //     await this.ghnService.createOrderGHNB(order);
  //   } catch (error) {
  //     console.error('Error sending order:', error);
  //     throw error;
  //   }
  // }

  // @Post('update')
  // async updateOrderStatus(@Body() statusUpdate: any) {
  //   try {
  //     console.log('Received order status update:', statusUpdate);
  //     await new Promise((resolve) => setTimeout(resolve, 10000));

  //     console.log('success order status update:', statusUpdate);
  //   } catch (error) {
  //     console.error('Error processing status update:', error);
  //     throw error;
  //   }
  // }

  @Get('provinces')
  getProvinces() {
    return this.ghnService.getProvinces();
  }

  @Post('districts')
  getDistricts(@Body() body: any) {
    return this.ghnService.getDistricts(body);
  }

  @Post('wards')
  getWards(@Body() body: any) {
    return this.ghnService.getWards(body);
  }

  @Post('fee')
  calculateFee(@Body() body: GHNCalculateFeeDto) {
    return this.ghnService.calculateShippingFee(body);
  }

  @Post('order')
  createOrder(@Body() body: any) {
    return this.ghnService.createOrderGHN(body);
  }

  @Post('tracking_order')
  trackingOrder(@Body() body: any) {
    return this.ghnService.trackingOrderGHN(body);
  }
}
