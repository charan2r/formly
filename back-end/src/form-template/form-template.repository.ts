/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FormTemplate } from '../model/form-template.entity';
import { CreateFormTemplateDto } from './create-form-template.dto';

@Injectable()
export class FormTemplateRepository extends Repository<FormTemplate> {
  constructor(private dataSource: DataSource) {
    super(FormTemplate, dataSource.createEntityManager());
  }

  // Method to create templates
  async createTemplate(dto: CreateFormTemplateDto): Promise<FormTemplate> {
    const template = this.create(dto);
    return this.save(template);
  }
}
