import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  customer_id: number;
}
