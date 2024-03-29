import { MigrationInterface, QueryRunner } from "typeorm";

export class discourde1660304727986 implements MigrationInterface {
    name = 'discourde1660304727986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friend_request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`senderId\` int NULL, \`receiverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`friendship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user1Id\` int NULL, \`user2Id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, UNIQUE INDEX \`IDX_240853a0c3353c25fb12434ad3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`permissionId\` int NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`server_user_role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`server_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nickname\` varchar(150) NOT NULL, \`userId\` int NULL, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(150) NOT NULL, \`password\` varchar(150) NOT NULL, \`email\` varchar(150) NOT NULL, \`join_date\` bigint NOT NULL, \`picture\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`channel_message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`send_time\` datetime NOT NULL, \`channelId\` int NULL, \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`hidden\` tinyint NOT NULL DEFAULT 0, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vocal_channel\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`hidden\` tinyint NOT NULL DEFAULT 0, \`serverId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`server\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`main_img\` varchar(255) NULL, \`logo\` varchar(255) NULL, \`link\` varchar(255) NULL, \`ownerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`banned_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`serverId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_9509b72f50f495668bae3c0171c\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_470e723fdad9d6f4981ab2481eb\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_19d92a79d938f4f61a27ca93dfb\` FOREIGN KEY (\`user1Id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_67e0cc82733694bb847a90ce723\` FOREIGN KEY (\`user2Id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_72e80be86cab0e93e67ed1a7a9a\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3130a39c1e4a740d044e685730\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` ADD CONSTRAINT \`FK_d9e438d88cfb64f7f8e1ae593c3\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_user_role\` ADD CONSTRAINT \`FK_84ded55633f70837063ca8f30de\` FOREIGN KEY (\`userId\`) REFERENCES \`server_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_user_role\` ADD CONSTRAINT \`FK_630ffe075616bbbcbd8ce8d1a3a\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_user\` ADD CONSTRAINT \`FK_4843825b732d9fcc5e20e5a0bb4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server_user\` ADD CONSTRAINT \`FK_62db1b45b87ca7e86ab8a4b1ca6\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD CONSTRAINT \`FK_67e2cdb305529e00e7abfff8d77\` FOREIGN KEY (\`channelId\`) REFERENCES \`channel\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel_message\` ADD CONSTRAINT \`FK_ee66179ce16c54b121415b3bd17\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`channel\` ADD CONSTRAINT \`FK_656efd5d40c72d70f0e63293966\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vocal_channel\` ADD CONSTRAINT \`FK_39521a58ae534fe90ea9e53f8d4\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`server\` ADD CONSTRAINT \`FK_f6359e2a174368f2787c48618b3\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`banned_user\` ADD CONSTRAINT \`FK_a1054385fa044377552bf3407b7\` FOREIGN KEY (\`serverId\`) REFERENCES \`server\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`banned_user\` ADD CONSTRAINT \`FK_cf40b754d224f10b4131f778db9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`banned_user\` DROP FOREIGN KEY \`FK_cf40b754d224f10b4131f778db9\``);
        await queryRunner.query(`ALTER TABLE \`banned_user\` DROP FOREIGN KEY \`FK_a1054385fa044377552bf3407b7\``);
        await queryRunner.query(`ALTER TABLE \`server\` DROP FOREIGN KEY \`FK_f6359e2a174368f2787c48618b3\``);
        await queryRunner.query(`ALTER TABLE \`vocal_channel\` DROP FOREIGN KEY \`FK_39521a58ae534fe90ea9e53f8d4\``);
        await queryRunner.query(`ALTER TABLE \`channel\` DROP FOREIGN KEY \`FK_656efd5d40c72d70f0e63293966\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP FOREIGN KEY \`FK_ee66179ce16c54b121415b3bd17\``);
        await queryRunner.query(`ALTER TABLE \`channel_message\` DROP FOREIGN KEY \`FK_67e2cdb305529e00e7abfff8d77\``);
        await queryRunner.query(`ALTER TABLE \`server_user\` DROP FOREIGN KEY \`FK_62db1b45b87ca7e86ab8a4b1ca6\``);
        await queryRunner.query(`ALTER TABLE \`server_user\` DROP FOREIGN KEY \`FK_4843825b732d9fcc5e20e5a0bb4\``);
        await queryRunner.query(`ALTER TABLE \`server_user_role\` DROP FOREIGN KEY \`FK_630ffe075616bbbcbd8ce8d1a3a\``);
        await queryRunner.query(`ALTER TABLE \`server_user_role\` DROP FOREIGN KEY \`FK_84ded55633f70837063ca8f30de\``);
        await queryRunner.query(`ALTER TABLE \`role\` DROP FOREIGN KEY \`FK_d9e438d88cfb64f7f8e1ae593c3\``);
        await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3130a39c1e4a740d044e685730\``);
        await queryRunner.query(`ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_72e80be86cab0e93e67ed1a7a9a\``);
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_67e0cc82733694bb847a90ce723\``);
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_19d92a79d938f4f61a27ca93dfb\``);
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_470e723fdad9d6f4981ab2481eb\``);
        await queryRunner.query(`ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_9509b72f50f495668bae3c0171c\``);
        await queryRunner.query(`DROP TABLE \`banned_user\``);
        await queryRunner.query(`DROP TABLE \`server\``);
        await queryRunner.query(`DROP TABLE \`vocal_channel\``);
        await queryRunner.query(`DROP TABLE \`channel\``);
        await queryRunner.query(`DROP TABLE \`channel_message\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`server_user\``);
        await queryRunner.query(`DROP TABLE \`server_user_role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`role_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_240853a0c3353c25fb12434ad3\` ON \`permission\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
        await queryRunner.query(`DROP TABLE \`friendship\``);
        await queryRunner.query(`DROP TABLE \`friend_request\``);
    }

}
