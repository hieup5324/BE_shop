import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { CreateGroupDto } from './groupDTO/createGroup.dto';
import { UpdateGroupDto } from './groupDTO/updateGroup.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity) private groupRepo: Repository<GroupEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  createGroup(requestBody: CreateGroupDto) {
    const user = this.groupRepo.create(requestBody);
    return this.groupRepo.save(user);
  }

  findAll() {
    return this.groupRepo.find();
  }

  async findGroupById(id: number) {
    const group = await this.groupRepo.findOneBy({ id });
    if (!group) {
      throw new NotFoundException('nice try');
    }
    return group;
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const group = await this.groupRepo.findOneBy(option);
    return group;
  }

  async updateGroup(id: number, requestBody: UpdateGroupDto) {
    let group = await this.findGroupById(id);
    if (!group) {
      throw new NotFoundException('group not exsits');
    }

    group = { ...group, ...requestBody };

    const updateGroup = this.groupRepo.save(group);
    return updateGroup;
  }

  async deleteGroup(id: number) {
    let group = await this.findOneByOption({
      id: id,
    });
    if (!group) {
      throw new NotFoundException('không có group này');
    }
    return this.groupRepo.remove(group);
  }
}
