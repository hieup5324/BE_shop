import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'email',
    example: 'hieup5324@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password',
    example: '123',
  })
  @IsNotEmpty()
  passWord: string;

  @ApiProperty({
    description: 'firtname',
    example: 'hieu',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'lastname',
    example: 'minh',
  })
  @IsNotEmpty()
  lastName: string;
}
