/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Organization } from './organization.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('text',{nullable:false})
    firstName: string;

    @Column('text',{nullable:false})
    lastName: string;

    @Column('text',{nullable:false})
    email: string;

    @Column('text',{nullable:false})
    passwordHash: string;

    @Column({ type: "enum", enum: ["SuperSuperAdmin", "SuperAdmin", "SubUser"] })
    userType: string;

    @Column({ type: "uuid", nullable: true })
    superUserId: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", nullable: true })
    lastLogin: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(() => Organization, organization => organization.users)
    organizations: Organization[];
}
