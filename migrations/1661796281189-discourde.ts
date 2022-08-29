import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1661796281189 implements MigrationInterface {
    name = 'discourde1661796281189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`private_message\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`private_message\` ADD \`content\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD \`content\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`private_message\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`private_message\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
