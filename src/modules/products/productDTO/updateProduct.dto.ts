import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class updateProductDto {
  @IsNotEmpty({ message: 'nameProduct is required' })
  @IsString({ message: 'nameProduct must be a string' })
  nameProduct: string;

  @IsNotEmpty({ message: 'nameDescription is required' })
  nameDescription: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber({}, { message: 'price must be a number' })
  @IsPositive({ message: 'price must be a positive number' })
  price: number;

  @IsNotEmpty({ message: 'stock is required' })
  @IsNumber({}, { message: 'stock must be a number' })
  stock: number;

  @IsNotEmpty({ message: 'images is required' })
  images: string[];

  @IsNotEmpty({ message: 'category is required' })
  categoryId: number;
}
