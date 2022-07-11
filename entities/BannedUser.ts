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
export class BannedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Server, (server) => server.bannedUsers)
  server: Server;

  @ManyToOne(() => User, (user) => user.bannedFrom)
  user: User;
}
