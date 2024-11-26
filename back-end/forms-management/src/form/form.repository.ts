// src/form/forms.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Form } from '../model/form.entity'; // Adjust the path as necessary
import { CreateFormDto } from './create-form.dto'; // Adjust the path as necessary

@Injectable()
export class FormsRepository extends Repository<Form> {
  constructor(private dataSource: DataSource) {
    super(Form, dataSource.createEntityManager());
  }

  // Method to create forms
  async createForm(dto: CreateFormDto): Promise<Form> {
    const form = this.create(dto); // Ensure dto matches Form structure
    return this.save(form);
  }
}