import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  tableName: string;

  @Column({ type: 'text', nullable: true })
  action: string; 

  @Column('text',{ nullable: true })
  type: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column('varchar',{ nullable: true })
  createdById: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}
