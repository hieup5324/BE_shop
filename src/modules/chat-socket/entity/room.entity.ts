import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('room')
export class RoomEntity extends BaseEntityIdNumber {
  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => MessageEntity, (mes) => mes.room)
  messages: MessageEntity[];

  @Column({ default: null })
  last_chat: Date;

  @Column({ default: null })
  last_message: string;
}
