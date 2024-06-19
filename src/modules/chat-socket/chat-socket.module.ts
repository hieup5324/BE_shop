import { Module } from '@nestjs/common';
import { ChatSocketGateway } from './chat-socket.gateway';
import { ChatSocketService } from './chat-socket.service';
import { RoomEntity } from './entity/room.entity';
import { MessageEntity } from './entity/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, MessageEntity]), UserModule],
  controllers: [RoomController],
  providers: [ChatSocketGateway, ChatSocketService, RoomService],
  exports: [],
})
export class ChatSocketModule {}
