import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Channel } from './Channel';
import { Server } from './Server';
import { User } from './User';

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.friendshipsSent, {
        cascade: ['insert', 'remove'],
    })
    user1: User;

    @ManyToOne(() => User, (user) => user.friendshipsReceived, {
        cascade: ['insert', 'remove'],
    })
    user2: User;
}
