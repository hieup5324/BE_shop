import { ValidateNested } from 'class-validator';
import { CreateShippingDto } from './createShipping.dto';
import { Type } from 'class-transformer';
import { Or } from 'typeorm';
import { OrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shipping_address: CreateShippingDto;

  @Type(() => OrderProductDto)
  @ValidateNested()
  order_products: OrderProductDto[];
}
