import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class PrivateMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext', nullable: false })
  content: string;

  @Column({ type: 'datetime', nullable: false })
  send_time: string;

  @ManyToOne(() => User, (user) => user.privateMessagesSent, {
    onDelete: 'SET NULL',
    cascade: ['insert'],
  })
  user1: User;

  @ManyToOne(() => User, (user) => user.privateMessagesReceived, {
    onDelete: 'SET NULL',
    cascade: ['insert'],
  })
  user2: User;
}
