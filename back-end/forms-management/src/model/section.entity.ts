/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { FormTemplate } from './form-template.entity';
import { FormFields } from './form-fields.entity';

@Entity('section')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  sectionId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.sections, { nullable: false })
  @JoinColumn({ name: 'form_template_id' })
  formTemplate: FormTemplate;

  @OneToMany(() => FormFields, (formFields) => formFields.section)
  formFields: FormFields[];
}
