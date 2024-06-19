import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLE } from '../common/users-role.enum';

export class RegisterUserDto {
  @ApiProperty({
    description: 'firtname',
    example: 'hieu',
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  fullname: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  phone: string;

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
  password: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  role: ROLE;
}
