import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @Length(1, 20)
  nameGroup: string;

  @MaxLength(250, {
    message: 'mo ta qua dai',
  })
  desGroup: string;
}
