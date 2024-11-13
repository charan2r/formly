/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Section } from './section.entity';
import { FormFieldsOption } from './form-fields-option.entity';

@Entity('form_fields')
export class FormFields {
    @PrimaryGeneratedColumn('uuid')
    field_id: string;

    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', length: 255 })
    question: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @ManyToOne(() => Section, (section) => section.form_fields, { onDelete: 'CASCADE' })
    section: Section;

    @OneToMany(() => FormFieldsOption, (formFieldsOption) => formFieldsOption.field, { cascade: true })
    options: FormFieldsOption[];
}
