import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChatSocketService } from './chat-socket.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatSocketController {
  constructor(private readonly chatSocketService: ChatSocketService) {}

  @Post('rooms')
  async createRoom(@Body() dto: CreateRoomDto) {
    return this.chatSocketService.createRoom(dto);
  }

  @Get('rooms')
  async getAllRooms() {
    return this.chatSocketService.getAllRooms();
  }

  @Get('rooms/:id')
  async getRoomById(@Param('id') id: string) {
    return this.chatSocketService.getRoomById(+id);
  }

  @Get('rooms/user/:userId')
  async getUserRooms(@Param('userId') userId: string) {
    return this.chatSocketService.getUserRooms(+userId);
  }
}
