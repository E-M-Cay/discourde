import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { BannedUser } from './BannedUser';
import { ChannelMessage } from './ChannelMessage';
import { FriendRequest } from './FriendRequest';
import { Friends } from './Friends';
import { Server } from './Server';
import { ServerUser } from './ServerUser';

@Entity()
export class User {
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

  @OneToMany(() => Server, (server) => server.owner)
  owned_servers: Server[];

  @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server)
  servers: ServerUser[];

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.author)
  channel_messages: ChannelMessage[];

  @OneToMany(() => Friends, (friend) => friend.friend)
  friends: Friends[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.user)
  bannedFrom: Server[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  sentFriendRequests: FriendRequest[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequest: FriendRequest[]
}
