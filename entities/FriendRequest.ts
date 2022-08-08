import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentFriendRequests, {
        onDelete: 'CASCADE',
    })
    sender: User;

    @ManyToOne(() => User, (user) => user.receivedFriendRequest, {
        onDelete: 'CASCADE',
    })
    receiver: User;
}
