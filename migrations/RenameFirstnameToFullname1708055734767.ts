import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameFirstnameToFullname1708055734767
  implements MigrationInterface
{
  name = 'RenameFirstnameToFullname1708055734767';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity RENAME COLUMN firstName TO fullName`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity RENAME COLUMN fullName TO firstName`,
    );
  }
}
