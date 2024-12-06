// src/form/forms.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Form } from '../model/form.entity';
import { CreateFormDto } from './create-form.dto'; 

@Injectable()
export class FormsRepository extends Repository<Form> {
  constructor(private dataSource: DataSource) {
    super(Form, dataSource.createEntityManager());
  }

  // Method to create forms
  async createForm(dto: CreateFormDto): Promise<Form> {
    const form = this.create(dto); 
    return this.save(form);
  }
}