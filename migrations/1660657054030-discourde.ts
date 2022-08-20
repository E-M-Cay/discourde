import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1660657054030 implements MigrationInterface {
    name = 'discourde1660657054030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`server_invitation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`receiverId\` int NULL, \`senderId\` int NULL, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`server_invitation\` ADD CONSTRAINT \`FK_19fdd89923aa0809483b257a801\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_invitation\` ADD CONSTRAINT \`FK_f3894eff0a0510949bdb5589c53\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_invitation\` ADD CONSTRAINT \`FK_57b51f60481ba50a1e6385da673\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`server_invitation\` DROP FOREIGN KEY \`FK_57b51f60481ba50a1e6385da673\``);
        await queryRunner.query(`ALTER TABLE \`server_invitation\` DROP FOREIGN KEY \`FK_f3894eff0a0510949bdb5589c53\``);
        await queryRunner.query(`ALTER TABLE \`server_invitation\` DROP FOREIGN KEY \`FK_19fdd89923aa0809483b257a801\``);
        await queryRunner.query(`DROP TABLE \`server_invitation\``);
    }

}
