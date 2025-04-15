import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomEntity } from './entity/chat-room.entity';
import { ChatMessageEntity } from './entity/chat-message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UserEntity } from '../users/userEntity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ROLE } from '../users/common/users-role.enum';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ChatSocketService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private readonly chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatMessageRepository: Repository<ChatMessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(token: string): Promise<UserEntity | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Payload:', payload);
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      } as UserEntity;
    } catch (error) {
      return null;
    }
  }

  async createRoom(dto: CreateRoomDto): Promise<ChatRoomEntity> {
    console.log('Creating room with DTO:', dto);
    const customer = await this.userRepository.findOne({
      where: { id: dto.customer_id },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const room = this.chatRoomRepository.create({
      name: dto.name,
      customer_id: dto.customer_id,
      is_active: true,
      is_resolved: false,
    });

    return this.chatRoomRepository.save(room);
  }

  async getAllRooms() {
    return this.chatRoomRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async getRoomById(id: number): Promise<ChatRoomEntity> {
    return this.chatRoomRepository.findOne({
      where: { id },
      relations: ['customer', 'messages', 'messages.sender'],
    });
  }

  async getRoomMessages(roomId: number): Promise<ChatMessageEntity[]> {
    return this.chatMessageRepository.find({
      where: { room: { id: roomId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async getUserRooms(userId: number) {
    return this.chatRoomRepository.find({
      where: { customer_id: userId },
      relations: ['customer', 'messages', 'messages.sender'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }

  async createMessage(
    dto: CreateMessageDto,
    sender: UserEntity,
  ): Promise<ChatMessageEntity> {
    const room = await this.getRoomById(dto.room_id);
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    const message = this.chatMessageRepository.create({
      content: dto.content,
      sender: { id: sender.id },
      room: { id: room.id },
      is_read: false,
    });

    return this.chatMessageRepository.save(message);
  }

  async markMessageAsRead(messageId: number): Promise<ChatMessageEntity> {
    const message = await this.chatMessageRepository.findOne({
      where: { id: messageId },
      relations: ['room'],
    });

    if (!message) {
      throw new BadRequestException('Message not found');
    }

    message.is_read = true;
    return this.chatMessageRepository.save(message);
  }

  async markRoomAsResolved(roomId: number): Promise<ChatRoomEntity> {
    const room = await this.getRoomById(roomId);
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    room.is_resolved = true;
    return this.chatRoomRepository.save(room);
  }
}
