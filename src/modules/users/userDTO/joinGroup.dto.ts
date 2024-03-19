import { IsNotEmpty, Length, MaxLength } from 'class-validator';

export class JoinGroupDto {
  userId: number[];
}
