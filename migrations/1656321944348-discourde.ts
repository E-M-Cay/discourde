import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1656321944348 implements MigrationInterface {
    name = 'discourde1656321944348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friendship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user1Id\` int NULL, \`user2Id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_19d92a79d938f4f61a27ca93dfb\` FOREIGN KEY (\`user1Id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_67e0cc82733694bb847a90ce723\` FOREIGN KEY (\`user2Id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_67e0cc82733694bb847a90ce723\``);
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_19d92a79d938f4f61a27ca93dfb\``);
        await queryRunner.query(`DROP TABLE \`friendship\``);
    }

}
