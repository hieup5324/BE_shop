import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  status: OrderStatus;
}
