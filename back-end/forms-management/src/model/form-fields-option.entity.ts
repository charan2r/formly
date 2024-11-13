/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormFields } from './form-fields.entity';

@Entity('form_fields_option')
export class FormFieldsOption {
    @PrimaryGeneratedColumn('uuid')
    form_fields_option_id: string;

    @Column({ type: 'varchar', length: 255 })
    option: string;

    @ManyToOne(() => FormFields, (formFields) => formFields.options, { onDelete: 'CASCADE' })
    field: FormFields;
}
