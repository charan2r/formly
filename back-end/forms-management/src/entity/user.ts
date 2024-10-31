import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Organization } from "./organization";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
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

    @OneToMany(() => Organization, organization => organization.user)
    organizations: Organization[];
}
