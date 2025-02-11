import { IsInt, IsNotEmpty } from 'class-validator';

export class createProductDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  price: number;

  description: string;

  photoUrl: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty({ message: 'category is required' })
  categoryId: number;
}
