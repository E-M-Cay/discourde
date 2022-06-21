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
import { ChannelMessage } from './ChannelMessage';
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
}
