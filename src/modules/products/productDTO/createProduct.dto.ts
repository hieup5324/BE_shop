import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createProductDto {
  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  photo_url: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty({ message: 'category is required' })
  @IsInt()
  categoryId: number;
}
