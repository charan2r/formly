import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tableName: string;

  @Column()
  action: string; 

  @Column({ nullable: true })
  type: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column({ nullable: true })
  createdById: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}
