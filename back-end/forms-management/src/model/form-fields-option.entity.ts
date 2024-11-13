/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FormFields } from './form-fields.entity';

@Entity('form_fields_option')
export class FormFieldsOption {
  @PrimaryGeneratedColumn('uuid')
  formFieldsOptionId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  option: string;

  @ManyToOne(() => FormFields, (formFields) => formFields.options, { nullable: false })
  @JoinColumn({ name: 'field_id' })
  formField: FormFields;
}
