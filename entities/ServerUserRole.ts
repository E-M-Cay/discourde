import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './Role';
import { ServerUser } from './ServerUser';

@Entity()
export class ServerUserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ServerUser, (serverUser) => serverUser.roles, {
        onDelete: 'CASCADE',
    })
    user: ServerUser;

    @ManyToOne(() => Role, (role) => role.users, {
        onDelete: 'CASCADE',
    })
    role: Role;
}
