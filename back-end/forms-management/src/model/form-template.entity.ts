/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Form } from './form.entity';
import { Category } from './category.entity';
import { FormField } from './form-fields.entity';
import { Organization } from './organization.entity';

export enum BorderStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
  NONE = 'none',
}

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

  @Column('varchar', { length: 255, nullable: true })
  pageSize: string;

  @Column('varchar', { length: 255, nullable: true, default: '10' })
  marginTop: number;

  @Column('varchar', { length: 255, nullable: true, default: '10' })
  marginBottom: number;

  @Column('varchar', { length: 255, nullable: true, default: '10' })
  marginLeft: number;

  @Column('varchar', { length: 255, nullable: true, default: '10' })
  marginRight: number;

  @Column('int', { nullable: true, default: 0 })
  borderWidth: number;

  @Column('int', { nullable: true, default: 0 })
  borderRadius: number;

  @Column({
    type: 'enum',
    enum: BorderStyle,
    nullable: true,
    default: BorderStyle.SOLID,
  })
  borderStyle: BorderStyle;

  @Column('varchar', { length: 7, nullable: true, default: '#000000' })
  borderColor: string;

  @Column('int', { nullable: true, default: 0 })
  boxShadowX: number;

  @Column('int', { nullable: true, default: 0 })
  boxShadowY: number;

  @Column('int', { nullable: true, default: 0 })
  boxShadowBlur: number;

  @Column('int', { nullable: true, default: 0 })
  boxShadowSpread: number;

  @Column('varchar', { length: 7, nullable: true, default: '#000000' })
  boxShadowColor: string;

  @Column('float', { nullable: true, default: 1.0 })
  boxShadowOpacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Form, (form) => form.formTemplate)
  forms: Form[];

  @Column('uuid', { nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.formTemplates, { onDelete: 'SET NULL' })
  category: Category;

  @Column('uuid', { nullable: true })
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization.formTemplates, { onDelete: 'SET NULL' })
  organization: Organization;

  @OneToMany(() => FormField, (formField) => formField.formTemplate)
  formFields: FormField[];
}
