import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/userEntity/user.entity';
import { ChatMessageEntity } from './chat-message.entity';

@Entity('chat_room')
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_resolved: boolean;

  @Column({ name: 'customer_id', type: 'int' })
  customer_id: number;

  @ManyToOne(() => UserEntity, (user) => user.customer_rooms)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: UserEntity;

  @OneToMany(() => ChatMessageEntity, (message) => message.room)
  messages: ChatMessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
