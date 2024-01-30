import { IsEmail, IsNotEmpty } from "class-validator";
import { ROLE } from "../user.entity";

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
    
    @IsNotEmpty()
    passWord: string;

    role: ROLE;
}