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

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {cascade: true})
  permissions: RolePermission[];

  @OneToMany(() => ServerUserRole, (serverUserRole) => serverUserRole.role, {cascade: true})
  users: ServerUserRole[];
}
