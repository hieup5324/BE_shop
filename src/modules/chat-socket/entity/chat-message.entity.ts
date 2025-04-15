import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from '../../users/userEntity/user.entity';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('chat_message')
export class ChatMessageEntity extends BaseEntityIdNumber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => ChatRoomEntity, (room) => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: ChatRoomEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 