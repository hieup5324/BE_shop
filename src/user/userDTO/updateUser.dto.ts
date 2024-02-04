import { IsEmail, IsNotEmpty } from 'class-validator';
import { ROLE } from '../userEntity/user.entity';
import { GroupEntity } from 'src/group/group.entity';

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
