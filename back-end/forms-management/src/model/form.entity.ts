/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { FormTemplate } from './form-template.entity';
  
  @Entity('form')
  export class Form {
    @PrimaryGeneratedColumn('uuid')
    formId: string;
  
    @Column('text')
    name: string;
  
    @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.forms)
    formTemplate: FormTemplate;
  }
  