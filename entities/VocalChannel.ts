import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { ChannelMessage } from './ChannelMessage';
import { Server } from './Server';

@Entity()
export class VocalChannel {
  users: number[];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  name: string;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;

  @ManyToOne(() => Server, (server) => server.vocalChannels, {
    onDelete: 'CASCADE',
  })
  server: Server;

  @AfterLoad()
  setUsers() {
    this.users = global.vocal_channel_to_user_list.get(this.id) || [];
  }
}
