import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUser1714708402793 implements MigrationInterface {
  name = 'AlterUser1714708402793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`age\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`firstName\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`lastName\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`fullName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`dob\` timestamp NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`gender\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`phone\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`gender\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`dob\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`fullName\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`lastName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`firstName\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`age\` int NOT NULL`);
  }
}
