import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Server } from './Server';

@Entity()
export class ServerInvitation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.receivedInvitations, {
        cascade: ['insert', 'remove'],
    })
    receiver: User;

    @ManyToOne(() => User, (user) => user.sentInvitations, {
        cascade: ['insert', 'remove'],
    })
    sender: User;

    @ManyToOne(() => Server, (server) => server.invitations, {
        cascade: ['insert', 'remove'],
    })
    server: Server;
}
