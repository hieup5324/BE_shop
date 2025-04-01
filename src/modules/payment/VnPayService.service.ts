import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { ConfigService } from '@nestjs/config';
import { VNpayRepository } from './vnpay.repository';
import * as dayjs from 'dayjs';
import { PAYMENT_STATUS } from '../shared/constants/common';

@Injectable()
export class VnPayService {
  constructor(
    private readonly configService: ConfigService,
    private readonly vnPayTransactionRepository: VNpayRepository,
  ) {}

  async createVNPayLink(order: any): Promise<any> {
    try {
      const ipAddr = '127.0.0.1';
      const tmnCode = this.configService.get<string>('VNP_TMN_CODE');
      const secretKey = this.configService.get<string>('VNP_HASH_SECRET');
      let vnpUrl = this.configService.get<string>('VNP_URL');
      const returnUrl = this.configService.get<string>('VNP_RETURN_URL');

      let createDate = dayjs().format('YYYYMMDDHHmmss');
      let amount = order.total_price * 100;
      let vnp_Params: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: order.order_code.toString(),
        vnp_OrderInfo: `Thanhtoanhoadon${order.id}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount.toString(),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
      };
      vnp_Params = this.sortObject(vnp_Params);

      let signData = qs.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
      const transaction = this.vnPayTransactionRepository.create({
        order: order,
        amount: order.total_price,
        order_info: vnp_Params.vnp_OrderInfo,
        transaction_status: PAYMENT_STATUS.PENDING,
      });
      await this.vnPayTransactionRepository.save(transaction);

      return { vnpay_url: vnpUrl };
    } catch (error) {
      console.log(error);
    }
  }
  sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  verifyPayment(query: any) {
    const secretKey = this.configService.get<string>('VNP_HASH_SECRET');
    const { vnp_SecureHash, ...otherParams } = query;

    const sortedParams = Object.keys(otherParams)
      .sort()
      .map((key) => `${key}=${otherParams[key]}`)
      .join('&');

    const signed = crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(sortedParams, 'utf-8'))
      .digest('hex');

    return signed === vnp_SecureHash;
  }

  async getTransactionByOrderId(orderId: string) {
    return await this.vnPayTransactionRepository.findOne({
      where: { order: { id: orderId } },
      relations: ['order'],
    });
  }

  async updateTransaction(trans: any) {
    return await this.vnPayTransactionRepository.save(trans);
  }

  async getTransactionById(id: string) {
    return await this.vnPayTransactionRepository.findOne({
      where: { id },
      relations: {
        order: true,
      },
    });
  }
}
