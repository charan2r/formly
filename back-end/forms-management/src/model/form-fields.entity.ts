/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from 'typeorm';
import { FormFieldsOption } from './form-fields-option.entity';
  
  @Entity('form_fields')
  export class FormField {
    @PrimaryGeneratedColumn('uuid')
    fieldId: string;
  
    @Column('text', { nullable: true }) 
    image: string;
  
    @Column('text')
    question: string;
  
    @Column('varchar')
    type: string;
  
    @OneToMany(() => FormFieldsOption, (formFieldsOption) => formFieldsOption.formField)
    options: FormFieldsOption[];
  }
  