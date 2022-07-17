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
import { Friendship } from './Friendship';
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

  @OneToMany(() => Server, (server) => server.owner, { cascade: true })
  owned_servers: Server[];

  @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server, {
    cascade: true,
  })
  servers: ServerUser[];

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.author)
  channel_messages: ChannelMessage[];

  @OneToMany(() => Friendship, (friendship) => friendship.user1, {
    cascade: true,
  })
  friendships: Friendship[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.user, {
    cascade: true,
  })
  bannedFrom: Server[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    cascade: true,
  })
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    cascade: true,
  })
  receivedFriendRequest: FriendRequest[];
}
