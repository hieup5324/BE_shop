import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ROLE } from '../common/users-role.enum';

export class UpdateUserDto {
  @IsString()
  fullName: string;

  dob: Date;

  @IsEmail()
  email: string;

  gender: string;

  phone: string;

  @IsNotEmpty()
  passWord: string;

  role: ROLE;
}
