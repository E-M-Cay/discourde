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
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.sentFriendRequests
  )
  sender: User

  @ManyToOne(
    () => User,
    (user) => user.receivedFriendRequest
  )
  receiver: User

  
  
}