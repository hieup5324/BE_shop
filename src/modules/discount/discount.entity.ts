import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
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

@Entity({ name: 'discount' })
export class DiscountEntity extends BaseEntityIdNumber {
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  discount_percentage: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: ProductEntity;
}
