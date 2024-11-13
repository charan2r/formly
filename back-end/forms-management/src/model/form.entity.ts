/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FormTemplate } from './form-template.entity';

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn('uuid')
  formId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.forms, { nullable: false })
  @JoinColumn({ name: 'form_template_id' })
  formTemplate: FormTemplate;
}
