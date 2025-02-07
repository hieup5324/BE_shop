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
  firstName: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEnum(USER_TYPE)
  type: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @TransformTrimSpace()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  role: ROLE;
}
