import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntityIdNumber {
  @Column({ unique: true, type: 'nvarchar' })
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
