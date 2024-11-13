/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Section } from './section.entity';
import { Form } from './form.entity';

@Entity('form_template')
export class FormTemplate {
    @PrimaryGeneratedColumn('uuid')
    form_template_id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'integer', default: 1 })
    version: number;

    @Column({ type: 'varchar', length: 50, default: 'draft' })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    header_text: string;

    @Column({ type: 'varchar', nullable: true })
    header_image_url: string;

    @Column({ type: 'varchar', nullable: true })
    question_font_style: string;

    @Column({ type: 'varchar', nullable: true })
    question_text_color: string;

    @Column({ type: 'varchar', nullable: true })
    background_color: string;

    @Column({ type: 'varchar', nullable: true })
    header_image: string;

    @Column({ type: 'varchar', nullable: true })
    logo_image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Section, (section) => section.form_template)
    sections: Section[];

    @OneToMany(() => Form, (form) => form.form_template)
    forms: Form[];
}
