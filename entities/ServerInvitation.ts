import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Server } from './Server';

@Entity()
export class ServerInvitation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.receivedServerInvitations, {
        cascade: ['insert', 'remove'],
    })
    receiver: User;

    @ManyToOne(() => Server, (server) => server.receivedServerInvitations, {
        cascade: ['insert', 'remove'],
    })
    server: Server;
    

}