export class GHNOrderStatusDto {
  order_code: string;
  status: string;
  updated_at: string;
  reason?: string;
  cod_amount?: number;
  total_amount?: number;
  shipping_fee?: number;
  expected_delivery_time?: string;
} 