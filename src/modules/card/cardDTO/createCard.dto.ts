import { IsNotEmpty, Length } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @Length(1, 20)
  position: string;

  user_id: number;
}
