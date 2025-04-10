import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GHNCalculateFeeDto } from './dto/caculator-fee.dto';

@Injectable()
export class GHNService {
  private readonly token = process.env.GHN_TOKEN;
  private readonly shopId = process.env.GHN_SHOP_ID;
  private readonly baseUrl =
    'https://dev-online-gateway.ghn.vn/shiip/public-api';

  constructor(private httpService: HttpService) {}

  async getProvinces() {
    const url = `${this.baseUrl}/master-data/province`;
    const headers = { Token: this.token };

    const response = await firstValueFrom(
      this.httpService.get(url, { headers }),
    );
    return response.data;
  }

  async getDistricts(body: any) {
    const url = `${this.baseUrl}/master-data/district`;
    const headers = { Token: this.token };

    const response = await firstValueFrom(
      this.httpService.post(url, body, { headers }),
    );
    return response.data;
  }

  async getWards(body: any) {
    const url = `${this.baseUrl}/master-data/ward`;
    const headers = { Token: this.token };

    const response = await firstValueFrom(
      this.httpService.post(url, body, { headers }),
    );
    return response.data;
  }

  async calculateShippingFee(payload: GHNCalculateFeeDto) {
    const url = `${this.baseUrl}/v2/shipping-order/fee`;
    const headers = {
      Token: this.token,
      ShopId: this.shopId,
    };

    const data = {
      ...payload,
      service_type_id: 2,
      from_district_id: 3440,
      from_ward_code: '13010',
      length: 50,
      width: 50,
      height: 50,
      weight: 20000,
    };

    const response = await firstValueFrom(
      this.httpService.post(url, data, { headers }),
    );
    return response.data;
  }

  async createOrderGHN(orderData: any) {
    try {
      const url = `${this.baseUrl}/v2/shipping-order/create`;
      const headers = {
        Token: this.token,
        ShopId: this.shopId,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, orderData, { headers }),
      );
      return {
        order_code_transport: response.data.data.order_code,
        fee_transport: response.data.data.total_fee,
      };
    } catch (error) {
      console.error('Error creating GHN order:', error.response.data);
      throw new Error(
        error.response.data.message || 'Failed to create GHN order',
      );
    }
  }

  async trackingOrderGHN(body: any) {
    try {
      const url = `${this.baseUrl}/v2/shipping-order/detail`;
      const headers = {
        Token: this.token,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking GHN order:', error.response.data);
      throw new Error(
        error.response.data.message || 'Failed to track GHN order',
      );
    }
  }

  async createOrderGHNB(orderData: any) {
    const url = `http://localhost:4000/v1/order/test/test`;
    // const headers = {
    //   Token: this.token,
    // };
    console.log('orderData', orderData);
    await firstValueFrom(this.httpService.post(url, orderData));
    return {
      msg: 'ngon',
    };
  }
}
