import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Channel } from './Channel';
import { Server } from './Server';
import { User } from './User';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content: string;

  @Column({ type: 'datetime', nullable: false })
  send_time: number;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channel_messages)
  author: User;
}
