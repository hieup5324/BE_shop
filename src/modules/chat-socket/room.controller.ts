import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createRoom(@currentUser() currentUser: UserEntity) {
    return await this.roomService.createRoom(currentUser);
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  async getRooms() {
    return await this.roomService.getRooms();
  }
}
