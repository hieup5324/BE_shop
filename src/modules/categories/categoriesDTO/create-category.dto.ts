import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty({ message: 'title khong duoc de trong' })
  @IsString()
  @Length(1, 20)
  title: string;

  @MaxLength(250, {
    message: 'mo ta qua dai',
  })
  @IsString()
  description: string;
}
