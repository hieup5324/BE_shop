import { IsEmail, IsNotEmpty } from "class-validator";
import { ROLE } from "../user.entity";

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    role: ROLE;
}