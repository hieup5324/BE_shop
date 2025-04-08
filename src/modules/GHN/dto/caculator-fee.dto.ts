import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GHNCalculateFeeDto {
  @IsNotEmpty()
  @IsNumber()
  to_district_id: number;

  @IsNotEmpty()
  @IsString()
  to_ward_code: string;
}
