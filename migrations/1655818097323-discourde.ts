import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1655818097323 implements MigrationInterface {
    name = 'discourde1655818097323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vocal_channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`hidden\` tinyint NOT NULL DEFAULT 0, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vocal_channel\` ADD CONSTRAINT \`FK_39521a58ae534fe90ea9e53f8d4\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vocal_channel\` DROP FOREIGN KEY \`FK_39521a58ae534fe90ea9e53f8d4\``);
        await queryRunner.query(`DROP TABLE \`vocal_channel\``);
    }

}
