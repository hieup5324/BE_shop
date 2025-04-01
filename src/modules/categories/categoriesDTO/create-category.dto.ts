import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @MaxLength(255)
  @IsString()
  description: string;
}
