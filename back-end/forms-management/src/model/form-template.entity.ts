/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Section } from './section.entity';
import { Form } from './form.entity';

@Entity('form_template')
export class FormTemplate {
  @PrimaryGeneratedColumn('uuid')
  formTemplateId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  version: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  status: string;

  @ManyToOne(() => Category, (category) => category.formTemplates, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headerText: string;

  @Column({ type: 'text', nullable: true })
  headerImageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  questionFontStyle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  questionTextColor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  backgroundColor: string;

  @Column({ type: 'text', nullable: true })
  headerImage: string;

  @Column({ type: 'text', nullable: true })
  logoImage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Section, (section) => section.formTemplate)
  sections: Section[];

  @OneToMany(() => Form, (form) => form.formTemplate)
  forms: Form[];
}
