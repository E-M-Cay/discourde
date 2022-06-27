import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1656319131569 implements MigrationInterface {
    name = 'discourde1656319131569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friends\` (\`id\` int NOT NULL AUTO_INCREMENT, \`friendId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_867f9b37dcc79035fa20e8ffe5e\` FOREIGN KEY (\`friendId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_867f9b37dcc79035fa20e8ffe5e\``);
        await queryRunner.query(`DROP TABLE \`friends\``);
    }

}
