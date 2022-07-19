import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1655822406381 implements MigrationInterface {
    name = 'discourde1655822406381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`join_date\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`join_date\` bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`join_date\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`join_date\` datetime NOT NULL`);
    }

}
