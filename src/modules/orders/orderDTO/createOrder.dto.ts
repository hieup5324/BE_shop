import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { PAYMENT_TYPE } from 'src/modules/shared/constants/common';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(PAYMENT_TYPE)
  payment_type: PAYMENT_TYPE;

  @IsNotEmpty()
  receiver_name: string;

  @IsNotEmpty()
  receiver_phone: string;

  @IsNotEmpty()
  receiver_address: string;

  @IsNotEmpty()
  district_id: number;

  @IsNotEmpty()
  @IsString()
  ward_id: string;
}
