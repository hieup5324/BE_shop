import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLength1708056177613 implements MigrationInterface {
  name = 'ChangeLength1708056177613';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity MODIFY COLUMN lastname VARCHAR(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_entity MODIFY COLUMN lastname VARCHAR(255)`,
    );
  }
}
