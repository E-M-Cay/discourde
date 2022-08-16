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
import { ServerInvitation } from './ServerInvitation';
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

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    link: string;

    @ManyToOne(() => User, (user) => user.owned_servers, {
        cascade: ['insert', 'remove'],
    })
    owner: User;

    @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server, {
        cascade: ['insert'],
    })
    users: ServerUser[];

    @OneToMany(() => Channel, (channel) => channel.server, {
        cascade: ['insert'],
    })
    channels: Channel[];

    @OneToMany(() => VocalChannel, (vocalChannel) => vocalChannel.server, {
        cascade: ['insert'],
    })
    vocalChannels: VocalChannel[];
    @OneToMany(() => Role, (role) => role.server, {
        cascade: ['insert'],
    })
    public roles: Role[];

    @OneToMany(() => BannedUser, (bannedUser) => bannedUser.server, {
        cascade: ['insert'],
    })
    bannedUsers: BannedUser[];

    // @JoinTable()
    // public invitedUsers: User[];

    // //server.receivedInvitations
    // @OneToMany(() => ServerInvitation, (serverInvitation) => serverInvitation.server, {
    //     cascade: ['insert'],
    // })
    // receivedInvitations: ServerInvitation[];



}
