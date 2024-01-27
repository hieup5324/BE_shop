import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { Permission } from './checkPermission.service';
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
    async findById(id: number){
        const user = await this.usersRepo.findOneBy({ id });
        if(!user) {
            throw new NotFoundException('nice try')
        }
        return user;
    }
    
    findByEmail(email: string){
        return  this.usersRepo.findOneBy({ email });
    }
    async updateById(id: number,requestbody:UpdateUserDto, currentUser: UserEntity){
        if (requestbody.role){
            throw new BadRequestException('khong co quyen doi role')
        }
        let user = await this.findById(id)
        if(!user){
            throw new NotFoundException('User does not exsits');
        }

        Permission.check(id , currentUser);
        user = { ...user, ...requestbody};

        const updateUser = await this.usersRepo.save(user);

        return {
            email: updateUser.email,
            fistname: updateUser.firstName,
            lastname: updateUser.lastName,
        }
    }
    async deleteById(id: number , currentUser : UserEntity) {
        let user = await this.findById(id)
        if(!user){
            throw new NotFoundException('ko co user nay');
        }
        Permission.check(id , currentUser);
        return this.usersRepo.remove(user);
    }
}