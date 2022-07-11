import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1656321269219 implements MigrationInterface {
    name = 'discourde1656321269219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friend_request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`banned_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`serverId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_9509b72f50f495668bae3c0171c\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_470e723fdad9d6f4981ab2481eb\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`banned_user\` ADD CONSTRAINT \`FK_a1054385fa044377552bf3407b7\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`banned_user\` ADD CONSTRAINT \`FK_cf40b754d224f10b4131f778db9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`banned_user\` DROP FOREIGN KEY \`FK_cf40b754d224f10b4131f778db9\``);
        await queryRunner.query(`ALTER TABLE \`banned_user\` DROP FOREIGN KEY \`FK_a1054385fa044377552bf3407b7\``);
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_470e723fdad9d6f4981ab2481eb\``);
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_9509b72f50f495668bae3c0171c\``);
        await queryRunner.query(`DROP TABLE \`banned_user\``);
        await queryRunner.query(`DROP TABLE \`friend_request\``);
    }

}
