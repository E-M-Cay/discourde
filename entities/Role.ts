import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RolePermission } from './RolePermission';
import { Server } from './Server';
import { ServerUserRole } from './ServerUserRole';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  name: string;

  @ManyToOne(() => Server, (server) => server.roles)
  server: Server;

  @ManyToOne(() => RolePermission, (rolePermission) => rolePermission.role)
  permissions: RolePermission[];

  @OneToMany(() => ServerUserRole, (serverUserRole) => serverUserRole.role)
  users: ServerUserRole[];
}
