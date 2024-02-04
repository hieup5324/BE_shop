import { UserEntity } from 'src/user/userEntity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @Column()
  user_id: number;

  @OneToOne(() => UserEntity, (user) => user.card, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
