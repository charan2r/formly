import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('uuid')
  createdById: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  
  @Column({ type: 'text', default: 'active', nullable: true })
  status: string;

  @ManyToOne(() => User, user => user.categories)
  @JoinColumn({ name: 'createdById' })  
  createdBy: User;  
}