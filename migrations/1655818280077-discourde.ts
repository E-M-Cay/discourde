import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1655818280077 implements MigrationInterface {
    name = 'discourde1655818280077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
    }

}
