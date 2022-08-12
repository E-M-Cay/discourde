import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Channel } from './Channel';
import { Server } from './Server';
import { User } from './User';

@Entity()
export class BannedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Server, (server) => server.bannedUsers, {
        cascade: ['insert', 'remove'],
    })
    server: Server;

    @ManyToOne(() => User, (user) => user.bannedFrom, {
        cascade: ['insert', 'remove'],
    })
    user: User;
}
