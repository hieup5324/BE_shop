import { Body, Controller, Get, Post } from '@nestjs/common';
import { GHNService } from './GHN.service';
import { GHNCalculateFeeDto } from './dto/caculator-fee.dto';
import { GHNOrderStatusDto } from './dto/order-status.dto';

@Controller('ghn')
export class GHNController {
  constructor(private readonly ghnService: GHNService) {}

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
