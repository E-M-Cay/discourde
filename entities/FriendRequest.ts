import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentFriendRequests, {
        cascade: ['insert', 'remove'],
    })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
        cascade: ['insert', 'remove'],
    })
    receiver: User;
}
