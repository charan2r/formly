/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { FormTemplate } from './form-template.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column('text')
  name: string;

  @Column('text')
  status: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' }) // Explicitly sets the foreign key
  organization: Organization;

  @Column('uuid', { nullable: false })
  createdById: string; // Maps to Organization's orgId

  @OneToMany(() => FormTemplate, (formTemplate) => formTemplate.category)
  formTemplates: FormTemplate[];
}
