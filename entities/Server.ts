import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.owned_servers)
  owner: User;

  @OneToMany(() => ServerUser, (ServerUser) => ServerUser.server)
  users: ServerUser[];

  @OneToMany(() => Channel, (channel) => channel.server)
  channels: Channel[];

  @OneToMany(() => VocalChannel, (vocalChannel) => vocalChannel.server)
  vocalChannels: VocalChannel[];
  @OneToMany(() => Role, (role) => role.server)
  roles: Role[];
}
