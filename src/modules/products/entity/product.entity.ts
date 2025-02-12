import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/userEntity/user.entity';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';

@Entity('product')
export class ProductEntity extends BaseEntityIdNumber {
  @Column({ type: 'varchar' })
  product_name: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int', nullable: true })
  final_price: number;

  @Column({ type: 'boolean', default: false })
  has_discount: boolean;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  photo_url: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: CategoryEntity;
}
