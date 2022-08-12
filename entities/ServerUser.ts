import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Server } from './Server';
import { ServerUserRole } from './ServerUserRole';
import { User } from './User';

@Entity()
export class ServerUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.servers, {
        cascade: ['insert', 'remove'],
    })
    user: User;

    @Column({ type: 'varchar', length: 150, nullable: false })
    nickname: string;

    @ManyToOne(() => Server, (server) => server.users, {
        cascade: ['insert', 'remove'],
        eager: true,
    })
    server: Server;

    @OneToMany(() => ServerUserRole, (serverUserRole) => serverUserRole.user, {
        cascade: ['insert'],
    })
    roles: ServerUserRole[];
}
