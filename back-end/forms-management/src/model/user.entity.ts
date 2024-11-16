/* eslint-disable prettier/prettier */
// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  firstName: string;

  @Column('text', { nullable: false })
  lastName: string;

  @Column('text', { nullable: false, unique: true })
  email: string;

  @Column('text', { nullable: false })
  passwordHash: string;

  @Column('text', { nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['PlatformAdmin', 'SuperAdmin', 'SubUser'] })
  userType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: false,
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization; // Relationship to Organization

  @Column({ type: 'uuid', nullable: true })
  organizationId: string; // Foreign key column to store organization ID

}
