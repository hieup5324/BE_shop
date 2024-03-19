import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'email',
    example: 'hieup5324@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'password',
    example: '123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  passWord: string;

  @ApiProperty({
    description: 'firtname',
    example: 'hieu',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    description: 'lastname',
    example: 'minh',
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'age',
    example: 20,
  })
  @IsNotEmpty({ message: 'Age is required' })
  age: number;
}
