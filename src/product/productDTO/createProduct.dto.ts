import { IsNotEmpty, Length, MaxLength } from "class-validator";

export class createProductDto{
    @IsNotEmpty()
    @Length(1, 20)
    nameProduct: string;
  
    @MaxLength(250, {
        message: 'mo ta qua dai',
    })
    nameDescription: string;
}