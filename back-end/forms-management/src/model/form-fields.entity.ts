/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { FormFieldsOption } from './form-fields-option.entity';
import { FormTemplate } from './form-template.entity';
  
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
  
    @Column({ type: 'varchar', nullable: true })
    width: string; 

    @Column({ type: 'varchar', nullable: true })
    height: string; 

    @Column({ type: 'varchar', nullable: true })
    x: string;

    @Column({ type: 'varchar', nullable: true })
    y: string;

    @Column({ type: 'varchar', nullable: true })
    color: string;

    @Column({ type: 'text', default: 'active' })
    status: string; 

    @OneToMany(() => FormFieldsOption, (formFieldsOption) => formFieldsOption.formField)
    options: FormFieldsOption[];

    @Column({ type: 'varchar', nullable: true })
    formTemplateId: string;

    @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.formFields, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'formTemplateId' })
    formTemplate: FormTemplate;
  }
  