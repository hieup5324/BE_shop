import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  room_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  name: string;
}
