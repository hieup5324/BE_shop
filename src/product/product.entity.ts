import { Transform } from 'class-transformer';
import { UserEntity } from './../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameProduct: string;

  @Column()
  nameDescription: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity,(userEntity)=> userEntity.product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
  @Transform(({ obj }) => obj.user.id)
  user: UserEntity;
}