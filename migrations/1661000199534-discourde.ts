import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1661000199534 implements MigrationInterface {
    name = 'discourde1661000199534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP FOREIGN KEY \`FK_67e2cdb305529e00e7abfff8d77\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD CONSTRAINT \`FK_67e2cdb305529e00e7abfff8d77\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP FOREIGN KEY \`FK_67e2cdb305529e00e7abfff8d77\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD CONSTRAINT \`FK_67e2cdb305529e00e7abfff8d77\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
