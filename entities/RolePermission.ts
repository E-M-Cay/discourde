import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    ManyToOne,
} from 'typeorm';
import { Role } from './Role';
import { Permission } from './Permission';

@Entity()
export class RolePermission {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Permission, (permission) => permission.roles, {
        cascade: ['insert', 'remove'],
    })
    permission: Permission;

    @ManyToOne(() => Role, (role) => role.permissions, {
        cascade: ['insert', 'remove'],
    })
    role: Role;
}
