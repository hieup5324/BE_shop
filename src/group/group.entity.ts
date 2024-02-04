import { UserEntity } from 'src/user/userEntity/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nameGroup: string;

  @Column({ unique: true })
  desGroup: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => UserEntity, (userEntity) => userEntity.group, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity[];
}
