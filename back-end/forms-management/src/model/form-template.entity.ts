/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Form } from './form.entity';
import { Category } from './category.entity';
import { FormField } from './form-fields.entity';

@Entity('form_template')
export class FormTemplate {
  @PrimaryGeneratedColumn('uuid')
  formTemplateId: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  version: number;

  @Column('varchar', { length: 50 })
  status: string;

  @Column('varchar', { length: 255, nullable: true })
  headerText: string;

  @Column('varchar', { length: 255, nullable: true })
  headerImageUrl: string;

  @Column('varchar', { length: 100, nullable: true })
  questionFontStyle: string;

  @Column('varchar', { length: 7, nullable: true })
  questionTextColor: string;

  @Column('varchar', { length: 7, nullable: true })
  backgroundColor: string;

  @Column('varchar', { length: 255, nullable: true })
  headerImage: string;

  @Column('varchar', { length: 255, nullable: true })
  logoImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Form, (form) => form.formTemplate)
  forms: Form[];

  @ManyToOne(() => Category, (category) => category.formTemplates, { onDelete: 'SET NULL' })
  category: Category;

  @OneToMany(() => FormField, (formField) => formField.formTemplate)
  formFields: FormField[];
}
