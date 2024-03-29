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
  JoinColumn,
} from 'typeorm';
import { BannedUser } from './BannedUser';
import { ChannelMessage } from './ChannelMessage';
import { FriendRequest } from './FriendRequest';
import { Friendship } from './Friendship';
import { PrivateMessage } from './PrivateMessage';
import { Server } from './Server';
import { ServerInvitation } from './ServerInvitation';
import { ServerUser } from './ServerUser';

@Entity()
export class User {
  status: number;
  vocalChannel: number;
  mediaStatus: {
    microphone: boolean;
    camera: boolean;
    audio: boolean;
  };

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  picture: string;

  @OneToMany(() => Server, (server) => server.owner, { cascade: ['insert'] })
  owned_servers: Server[];

  @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server, {
    cascade: ['insert'],
  })
  servers: ServerUser[];

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.author, {
    cascade: ['insert'],
  })
  channel_messages: ChannelMessage[];

  @OneToMany(() => Friendship, (friendship) => friendship.user1, {
    cascade: ['insert'],
  })
  friendshipsSent: Friendship[];

  @OneToMany(
    () => Friendship,
    (friendship) => friendship.user1,

    { cascade: ['insert'] }
  )
  friendshipsReceived: Friendship[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.user, {
    cascade: ['insert'],
  })
  bannedFrom: Server[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    cascade: ['insert'],
  })
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    cascade: ['insert'],
  })
  receivedFriendRequests: FriendRequest[];

  @OneToMany(() => PrivateMessage, (message) => message.user1, {
    cascade: ['insert'],
  })
  privateMessagesSent: PrivateMessage[];

  @OneToMany(() => PrivateMessage, (message) => message.user2, {
    cascade: ['insert'],
  })
  privateMessagesReceived: PrivateMessage[];

  @OneToMany(() => ServerInvitation, (invitation) => invitation.sender, {
    cascade: ['insert'],
  })
  sentInvitations: ServerInvitation[];

  @OneToMany(() => ServerInvitation, (invitation) => invitation.receiver, {
    cascade: ['insert'],
  })
  receivedInvitations: ServerInvitation[];

  @AfterLoad()
  setStatus() {
    this.status = global.user_id_to_status.get(this.id) || 0;
    this.vocalChannel = 0;
  }

  @AfterLoad()
  setMediaStatus() {
    this.mediaStatus = global.user_id_to_media_status.get(this.id) || {
      microphone: true,
      camera: false,
      audio: true,
    };
  }

  // // receivedServerInvitations
  // @ManyToMany(() => Server, (server) => server.receivedInvitations, {
  //     cascade: ['insert'],
  // } as any)
  // @JoinTable()
  // receivedServerInvitations: Server[];
}
