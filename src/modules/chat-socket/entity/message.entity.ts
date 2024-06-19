import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: any;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  room_id: number;

  @ManyToOne(() => RoomEntity, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @Column()
  message: string;
}
