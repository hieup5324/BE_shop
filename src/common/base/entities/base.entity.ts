import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// @Entity()
export class BaseEntityIdNumber {
  @PrimaryGeneratedColumn()
  id?: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt?: Date;
}
