import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLE } from '../common/users-role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsOptional()
  dob: Date;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsOptional()
  role: ROLE;
}
