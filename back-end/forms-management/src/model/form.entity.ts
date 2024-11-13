/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { FormTemplate } from './form-template.entity';

@Entity('form')
export class Form {
    @PrimaryGeneratedColumn('uuid')
    form_id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.forms, { onDelete: 'CASCADE' })
    form_template: FormTemplate;
}
