import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { RolePermission } from './RolePermission';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: false,
        unique: true,
    })
    name: string;

    @OneToMany(
        () => RolePermission,
        (rolePermission) => rolePermission.permission,
        {
            cascade: ['insert'],
        }
    )
    roles: RolePermission[];
}
