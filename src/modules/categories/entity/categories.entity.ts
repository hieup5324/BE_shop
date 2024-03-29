import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntityIdNumber {
  @Column({ unique: true, type: 'nvarchar' })
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  users: UserEntity;

  @OneToMany(() => ProductEntity, (product) => product.categories)
  products: ProductEntity[];
}
