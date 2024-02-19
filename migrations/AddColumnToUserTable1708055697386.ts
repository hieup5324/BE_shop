import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToUserTable1708055697386 implements MigrationInterface {
  name = 'AddColumnToUserTable1708055697386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity ADD COLUMN namenu VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_entity DROP COLUMN namenu`);
  }
}
