/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { FormField } from './form-fields.entity';
  
  @Entity('form_fields_option')
  export class FormFieldsOption {
    @PrimaryGeneratedColumn('uuid')
    formFieldsOptionId: string;
  
    @Column('text')
    option: string;
  
    @ManyToOne(() => FormField, (formField) => formField.options)
    formField: FormField;
  }
  