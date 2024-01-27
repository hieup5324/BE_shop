import { BadRequestException, Injectable, Request } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "./userDTO/registerUser.dto";
import { UserService } from "./user.service";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./userDTO/loginUser.dto";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,private userService: UserService){}
    async register(requestBody: RegisterUserDto) {
        const userByEmail = await this.userService.findByEmail(requestBody.email);
        if(userByEmail){
            throw new BadRequestException('email ton tai');
        }
        const hashedPw = await bcrypt.hash(requestBody.password, 10);
        requestBody.password = hashedPw;
        const saveUser = await this.userService.create(requestBody);
        const payload = {
            id: saveUser.id,
            email: saveUser.email,
            firtname: saveUser.firstName,
            lastname: saveUser.lastName,
            role: saveUser.role,
        };

        const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
        });

        return {
            msg : 'them user thanh cong',
            access_token,
        };
    }
    async login(requestBody: LoginUserDto){
        const userByEmail = await this.userService.findByEmail(requestBody.email);
        if(!userByEmail){
            throw new BadRequestException('tai khoan khong ton tai');
        }
        const checkpw = await bcrypt.compare(requestBody.password, userByEmail.passWord);
        if(!checkpw){
            throw new BadRequestException('sai mat khau')
        }
        const payload = {
            id: userByEmail.id,
            email: userByEmail.email,
            firtname: userByEmail.firstName,
            lastname: userByEmail.lastName,
            role: userByEmail.role,
        };

        const access_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
        });

        return {
            msg : 'login thanh cong',
            access_token,
        };
    }
}