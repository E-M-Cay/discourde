import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { BannedUser } from './BannedUser';
import { Channel } from './Channel';
import { Role } from './Role';
import { ServerUser } from './ServerUser';
import { User } from './User';
import { VocalChannel } from './VocalChannel';

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    main_img: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    logo: string;

    @ManyToOne(() => User, (user) => user.owned_servers, {
        onDelete: 'CASCADE',
    })
    owner: User;

    @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server, {
        onDelete: 'CASCADE',
    })
    users: ServerUser[];

    @OneToMany(() => Channel, (channel) => channel.server, {
        onDelete: 'CASCADE',
    })
    channels: Channel[];

    @OneToMany(() => VocalChannel, (vocalChannel) => vocalChannel.server, {
        onDelete: 'CASCADE',
    })
    vocalChannels: VocalChannel[];
    @OneToMany(() => Role, (role) => role.server, {
        onDelete: 'CASCADE',
    })
    public roles: Role[];

    @OneToMany(() => BannedUser, (bannedUser) => bannedUser.server, {
        onDelete: 'CASCADE',
    })
    bannedUsers: BannedUser[];
}
