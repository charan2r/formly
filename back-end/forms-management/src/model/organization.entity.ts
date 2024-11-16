/* eslint-disable prettier/prettier */
// organization.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Category } from "./category.entity";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  orgId: string;

  @Column('text', { nullable: false })
  name: string;

  @Column({ type: "text", nullable: true })
  logo: string;

  @Column({ type: "text", nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  street: string;

  @Column({ type: "text", nullable: true })
  city: string;

  @Column({ type: "text", nullable: true })
  state: string;

  @Column({ type: "text", nullable: true })
  zip: string;

  @Column({ type: "text", nullable: true })
  category: string;

  @Column({ type: "text", nullable: true })
  website: string;

  @Column({ type: 'uuid', nullable: true })
  superAdminId: string; // Optional: Holds the ID of the designated SuperAdmin user

  @Column({ type: 'timestamp', nullable: true })
  lastActive: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'text', default: 'active', nullable: true })
  status: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.organization)
  users: User[]; // Relationship to multiple users

  @OneToMany(() => Category, (category) => category.organization)
  categories: Category[]; // Relationship to multiple categories
}
