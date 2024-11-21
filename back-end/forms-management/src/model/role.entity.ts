import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @ManyToOne(() => Organization, { nullable: false })
  organization: Organization;

  @Column()
  role: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

}
