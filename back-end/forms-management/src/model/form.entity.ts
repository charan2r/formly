/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FormTemplate } from './form-template.entity'; // Adjust the path as necessary
import { Category } from './category.entity'; // Adjust the path as necessary

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  formId: string; // Unique identifier for the form

  @Column('varchar', { length: 255 })
  name: string; // Name of the form

  @Column('varchar', { length: 50 })
  status: string; // Status of the form (e.g., "active", "deleted")

  @Column('text', { nullable: true })
  description: string; // Optional description for the form

  @Column('uuid', { nullable: true })
  formTemplateId: string; // Foreign key to the FormTemplate

  @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.forms, { onDelete: 'SET NULL' })
  formTemplate: FormTemplate; // Relationship to FormTemplate

  @Column('uuid', { nullable: true })
  categoryId: string; // Foreign key to the Category

  

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the form was created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the form was last updated
}