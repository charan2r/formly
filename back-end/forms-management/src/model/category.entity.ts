/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { FormTemplate } from './form-template.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.categories, { nullable: false })
  @JoinColumn({ name: 'userId' })  
  user: User;

  @OneToMany(() => FormTemplate, (formTemplate) => formTemplate.category)
  formTemplates: FormTemplate[];
}
