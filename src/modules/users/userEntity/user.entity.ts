import { Exclude } from 'class-transformer';
import { CardEntity } from 'src/modules/card/card.entity';
import { GroupEntity } from 'src/modules/group/group.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { ROLE } from '../common/users-role.enum';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityIdNumber {
  @Column({ unique: true, type: 'nvarchar' })
  email: string;

  @Column({ type: 'nvarchar' })
  @Exclude()
  passWord: string;

  @Column({ type: 'nvarchar' })
  firstName: string;

  @Column({ type: 'nvarchar' })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @OneToOne(() => CardEntity, (card) => card.user, {
    cascade: true,
  })
  card: CardEntity;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.user, {
    cascade: true,
  })
  product: ProductEntity[];

  @OneToMany(() => CategoryEntity, (categoryEntity) => categoryEntity.user, {
    cascade: true,
  })
  categories: CategoryEntity[];

  @ManyToMany(() => GroupEntity, (groupEntity) => groupEntity.user, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_group',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
  })
  group: GroupEntity[];
}
