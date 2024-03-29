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

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ type: 'datetime', nullable: false })
  send_time: string;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channel_messages, {
    onDelete: 'SET NULL',
    cascade: ['insert'],
  })
  author: User;
}
