import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    AfterLoad,
} from 'typeorm';
import { BannedUser } from './BannedUser';
import { ChannelMessage } from './ChannelMessage';
import { FriendRequest } from './FriendRequest';
import { Friendship } from './Friendship';
import { Server } from './Server';
import { ServerUser } from './ServerUser';

@Entity()
export class User {
    status: number;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    })
    email: string;

    @Column({
        type: 'bigint',
        nullable: false,
    })
    join_date: number;

    @OneToMany(() => Server, (server) => server.owner, { cascade: true })
    owned_servers: Server[];

    @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server, {
        onDelete: 'CASCADE',
    })
    servers: ServerUser[];

    @OneToMany(
        () => ChannelMessage,
        (channelMessage) => channelMessage.author,
        {
            onDelete: 'CASCADE',
        }
    )
    channel_messages: ChannelMessage[];

    @OneToMany(() => Friendship, (friendship) => friendship.user1, {
        onDelete: 'CASCADE',
    })
    friendships: Friendship[];

    @OneToMany(() => BannedUser, (bannedUser) => bannedUser.user, {
        onDelete: 'CASCADE',
    })
    bannedFrom: Server[];

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
        onDelete: 'CASCADE',
    })
    sentFriendRequests: FriendRequest[];

    @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
        onDelete: 'CASCADE',
    })
    receivedFriendRequest: FriendRequest[];

    @AfterLoad()
    setStatus() {
        this.status = global.user_id_to_status.get(this.id) || 0;
    }
}
