import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1660249814742 implements MigrationInterface {
    name = 'discourde1660249814742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`picture\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`picture\``);
    }

}
