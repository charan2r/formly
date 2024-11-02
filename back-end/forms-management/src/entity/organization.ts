import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Organization {
    @PrimaryGeneratedColumn("uuid")
    orgId: string;

    @Column({type:'text',nullable:false})
    name: string;

    @Column({ type: "uuid" })
    superSuperAdminId: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.organizations)
    user: User;
}