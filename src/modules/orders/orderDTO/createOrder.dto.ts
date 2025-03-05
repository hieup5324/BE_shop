import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { PAYMENT_TYPE } from 'src/modules/shared/constants/common';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsEnum(PAYMENT_TYPE)
  payment_type: PAYMENT_TYPE;
}
