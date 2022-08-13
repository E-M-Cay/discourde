import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1660414899252 implements MigrationInterface {
    name = 'discourde1660414899252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`private_message\` ADD \`send_time\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`private_message\` DROP COLUMN \`send_time\``);
    }

}
