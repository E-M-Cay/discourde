import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ChannelMessage } from './ChannelMessage';
import { Server } from './Server';

@Entity()
export class Channel {
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

    @ManyToOne(() => Server, (server) => server.channels, {
        onDelete: 'CASCADE',
    })
    server: Server;

    @OneToMany(() => ChannelMessage, (message) => message.channel, {
        onDelete: 'SET NULL',
    })
    messages: ChannelMessage[];
}
