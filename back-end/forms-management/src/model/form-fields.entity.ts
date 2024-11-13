/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { FormFieldsOption } from './form-fields-option.entity';

@Entity('form_fields')
export class FormFields {
  @PrimaryGeneratedColumn('uuid')
  fieldId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  question: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: string; 

  @ManyToOne(() => Section, (section) => section.formFields, { nullable: false })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @OneToMany(() => FormFieldsOption, (formFieldsOption) => formFieldsOption.formField)
  options: FormFieldsOption[];
}
