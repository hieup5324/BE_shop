import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class updateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  name: string;

  @MaxLength(250)
  @IsString()
  description?: string;
}
