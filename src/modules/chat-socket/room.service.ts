import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserEntity } from '../users/userEntity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { Repository } from 'typeorm';

export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepo: Repository<RoomEntity>,
    private jwtService: JwtService,
  ) {}

  async getUserFromToken(client: Socket) {
    // const token: any = client?.handshake?.query?.token;
    // try {
    //   const user = await this.jwtService.verify(token);
    //   return user;
    // } catch (error) {
    //   console.log('error', error);
    // }
  }

  async createRoom(currentUser: UserEntity) {
    const room = this.roomRepo.create();
    room.user = currentUser;
    return this.roomRepo.save(room);
  }

  async getRooms() {
    return this.roomRepo.find();
  }
}
