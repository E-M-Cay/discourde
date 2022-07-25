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
export class VocalChannel {
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
}
