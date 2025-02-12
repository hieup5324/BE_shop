import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from '../products/entity/product.entity';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from '../users/userEntity/user.entity';

@Entity({ name: 'review' })
export class ReviewEntity extends BaseEntityIdNumber {
  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  comment: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
