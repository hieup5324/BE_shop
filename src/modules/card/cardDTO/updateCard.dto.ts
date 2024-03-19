import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCardDto {
  @IsNotEmpty()
  @Length(1, 20)
  position: string;

  user_id: number;
}
