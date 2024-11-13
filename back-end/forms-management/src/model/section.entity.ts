/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { FormTemplate } from './form-template.entity';
import { FormFields } from './form-fields.entity';

@Entity('section')
export class Section {
    @PrimaryGeneratedColumn('uuid')
    section_id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => FormTemplate, (formTemplate) => formTemplate.sections, { onDelete: 'CASCADE' })
    form_template: FormTemplate;

    @OneToMany(() => FormFields, (formFields) => formFields.section)
    form_fields: FormFields[];
}
