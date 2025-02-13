import { IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  product_id: number;

  @IsNotEmpty()
  quantity: number;
}
