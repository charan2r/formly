import { Entity, ManyToOne, PrimaryColumn, JoinColumn, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity()
export class RolePermission {
  @PrimaryColumn('uuid')
  roleId: string;

  @PrimaryGeneratedColumn('uuid')
  uuId: string;
  @PrimaryColumn('uuid')
  permissionId: string;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column({ default: 'active' })
  status: string;
}
