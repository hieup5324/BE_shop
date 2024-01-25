import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { RegisterUserDto } from './userDTO/registerUser.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>) {}

    create(requestbody: RegisterUserDto){
        const user = this.usersRepo.create(requestbody);
 
        return this.usersRepo.save(user);
    }
    findAll(){
        return this.usersRepo.find();
    }
    findById(id: number){
        return  this.usersRepo.findOneBy({ id });
    }
    findByEmail(email: string){
        return  this.usersRepo.findOneBy({ email });
    }
    async updateById(id: number,requestbody:UpdateUserDto){
        let user = await this.findById(id)
        if(!user){
            throw new NotFoundException('User does not exsits');
        }
        user = { ...user, ...requestbody};

        return this.usersRepo.save(user);
    }
    async deleteById(id: number) {
        let user = await this.findById(id)
        if(!user){
            throw new NotFoundException('ko co user nay');
        }
        return this.usersRepo.remove(user);
    }
}