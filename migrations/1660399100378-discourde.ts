import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1660399100378 implements MigrationInterface {
    name = 'discourde1660399100378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`private_message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`user1Id\` int NULL, \`user2Id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`private_message\` ADD CONSTRAINT \`FK_7a7ad6dd3c2e54f0d03afa843b7\` FOREIGN KEY (\`user1Id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`private_message\` ADD CONSTRAINT \`FK_b145f5f6f59892675dffdbf4db4\` FOREIGN KEY (\`user2Id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`private_message\` DROP FOREIGN KEY \`FK_b145f5f6f59892675dffdbf4db4\``);
        await queryRunner.query(`ALTER TABLE \`private_message\` DROP FOREIGN KEY \`FK_7a7ad6dd3c2e54f0d03afa843b7\``);
        await queryRunner.query(`DROP TABLE \`private_message\``);
    }

}
