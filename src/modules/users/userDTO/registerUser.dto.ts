import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLE } from '../common/users-role.enum';
import { TransformTrimSpace } from 'src/modules/shared/decorators/transform-trim-space.decorator';
import { USER_TYPE } from 'src/modules/shared/constants/common';

export class RegisterUserDto {
  @TransformTrimSpace()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsEnum(USER_TYPE)
  @IsOptional()
  type: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  photo_url?: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @IsOptional()
  @IsDate()
  date_of_birth?: Date;

  @IsOptional()
  role: ROLE;
}
