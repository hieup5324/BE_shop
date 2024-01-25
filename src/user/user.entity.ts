import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: ROLE.USER})
  @Exclude()
  role: ROLE;
}

