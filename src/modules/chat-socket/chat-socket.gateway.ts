import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSocketService } from './chat-socket.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserEntity } from '../users/userEntity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chat',
  path: '/socket.io',
})
export class ChatSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, UserEntity> = new Map();

  constructor(
    private readonly chatSocketService: ChatSocketService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ForbiddenException('Token không hợp lệ');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      this.connectedUsers.set(client.id, user);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(client: Socket, data: any) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user) {
        throw new ForbiddenException('Unauthorized');
      }

      const room = await this.chatSocketService.getRoomById(data.data.room_id);
      if (!room) {
        throw new BadRequestException('Room not found');
      }

      if (room.customer_id !== user.id && user.id !== 3) {
        throw new ForbiddenException('Unauthorized access to room');
      }

      client.join(`room_${data.data.room_id}`);

      const messages = await this.chatSocketService.getRoomMessages(
        data.data.room_id,
      );
      client.emit('chat_history', { messages });

      return { success: true };
    } catch (error) {
      console.error('Error joining room:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: any) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user) {
        throw new ForbiddenException('Unauthorized');
      }

      const dto = new CreateMessageDto();
      dto.room_id = data.data.room_id;
      dto.content = data.data.content;
      dto.name = data.data.name;

      const message = await this.chatSocketService.createMessage(dto, user);

      const room = await this.chatSocketService.getRoomById(dto.room_id);
      if (room) {
        const roomUsers = [room.customer_id, 3]; // 3 là admin_id
        roomUsers.forEach((userId) => {
          const userSocket = Array.from(this.connectedUsers.entries()).find(
            ([_, u]) => u.id === userId,
          )?.[0];
          if (userSocket) {
            this.server.to(String(userSocket)).emit('new_message', message);
          }
        });
      }

      return { success: true, message };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(client: Socket, data: any) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user) {
        throw new ForbiddenException('Unauthorized');
      }

      const message = await this.chatSocketService.markMessageAsRead(
        data.data.message_id,
      );
      this.server
        .to(`room_${message.room.id}`)
        .emit('message_read', { message_id: message.id });
      return { success: true, message };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark_as_resolved')
  async handleMarkAsResolved(client: Socket, data: any) {
    try {
      const user = this.connectedUsers.get(client.id);
      if (!user || user.id !== 3) {
        // Chỉ admin mới được đánh dấu đã giải quyết
        throw new ForbiddenException('Unauthorized');
      }

      const room = await this.chatSocketService.markRoomAsResolved(
        data.data.room_id,
      );
      this.server
        .to(`room_${room.id}`)
        .emit('room_resolved', { room_id: room.id });
      return { success: true, room };
    } catch (error) {
      console.error('Error marking room as resolved:', error);
      return { success: false, error: error.message };
    }
  }
}
