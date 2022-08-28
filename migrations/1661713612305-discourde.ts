import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1661713612305 implements MigrationInterface {
    name = 'discourde1661713612305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_656efd5d40c72d70f0e63293966\``);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_656efd5d40c72d70f0e63293966\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_656efd5d40c72d70f0e63293966\``);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_656efd5d40c72d70f0e63293966\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
