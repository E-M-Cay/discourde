import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1661713469249 implements MigrationInterface {
    name = 'discourde1661713469249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`server_user\` DROP FOREIGN KEY \`FK_62db1b45b87ca7e86ab8a4b1ca6\``);
        await queryRunner.query(`ALTER TABLE \`server_user\` ADD CONSTRAINT \`FK_62db1b45b87ca7e86ab8a4b1ca6\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`server_user\` DROP FOREIGN KEY \`FK_62db1b45b87ca7e86ab8a4b1ca6\``);
        await queryRunner.query(`ALTER TABLE \`server_user\` ADD CONSTRAINT \`FK_62db1b45b87ca7e86ab8a4b1ca6\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
