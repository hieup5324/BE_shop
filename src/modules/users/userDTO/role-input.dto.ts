import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_ROLE } from 'src/modules/shared/constants/common';

export class RoleInput {
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  roleName: string;
}
