/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { FormTemplate } from './form-template.entity';
  import { FormField } from './form-fields.entity';
  
  @Entity('section')
  export class Section {
    @PrimaryGeneratedColumn('uuid')
    sectionId: string;
  
    @Column('text')
    name: string;
  
    @Column('text', { nullable: true })
    description: string;
  
    @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.sections)
    formTemplate: FormTemplate;
  
    @OneToMany(() => FormField, (formField) => formField.section)
    formFields: FormField[];
  }
  