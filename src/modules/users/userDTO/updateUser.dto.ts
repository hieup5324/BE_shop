import { IsEmail, IsNotEmpty } from 'class-validator';
import { ROLE } from '../common/users-role.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  passWord: string;

  role: ROLE;

  group_id: number;
}
