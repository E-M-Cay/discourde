import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    ManyToOne,
} from 'typeorm';
import { Server } from './Server';
import { ServerUserRole } from './ServerUserRole';
import { User } from './User';

@Entity()
export class ServerUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150, nullable: false })
    nickname: string;

    @ManyToOne(() => User, (user) => user.servers, {
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(() => Server, (server) => server.users, {
        onDelete: 'CASCADE',
    })
    server: Server;

    @OneToMany(() => ServerUserRole, (serverUserRole) => serverUserRole.user, {
        onDelete: 'CASCADE',
    })
    roles: ServerUserRole[];
}
