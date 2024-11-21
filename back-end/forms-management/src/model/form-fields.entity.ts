/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Section } from './section.entity';
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
  
    @ManyToOne(() => Section, (section) => section.formFields)
    section: Section;
  
    @OneToMany(() => FormFieldsOption, (formFieldsOption) => formFieldsOption.formField)
    options: FormFieldsOption[];
  }
  