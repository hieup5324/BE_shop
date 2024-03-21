import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class OrderProductDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  product_unit_price: number;

  @IsNotEmpty()
  product_quantity: number;
}
