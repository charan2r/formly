/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { FormTemplate } from './form-template.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.categories, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => FormTemplate, (formTemplate) => formTemplate.category)
  formTemplates: FormTemplate[];
}
