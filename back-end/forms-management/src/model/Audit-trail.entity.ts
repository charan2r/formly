import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tableName: string;

  @Column()
  action: string; 

  @Column('jsonb')
  data: Record<string, any>;

  @Column({ nullable: true })
  createdById: string;

  @Column()
  createdAt: Date;
}
