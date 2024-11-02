/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from './user.entity';

@Entity()
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    orgId: string;

    @Column('text', { nullable: false })
    name: string;

    @Column({ type: "uuid" })
    superSuperAdminId: string;

    @Column({ type: "text", nullable: true })
    category: string;

    @Column({ type: "timestamp", nullable: true })
    lastActive: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];
}
