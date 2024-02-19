import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeType1708056348784 implements MigrationInterface {
  name = 'ChangeType1708056348784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity MODIFY COLUMN age VARCHAR(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user_entity MODIFY COLUMN age Int`);
  }
}
