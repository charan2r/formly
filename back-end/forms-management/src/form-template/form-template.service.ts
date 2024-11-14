/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { FormTemplateRepository } from './form-template.repository';
import { CreateFormTemplateDto } from './create-form-template.dto';
import { FormTemplate } from '../model/form-template.entity';

@Injectable()
export class FormTemplateService {
  constructor(private readonly formTemplateRepository: FormTemplateRepository) {}

  // Method to create templates
  async createTemplate(createFormTemplateDto: CreateFormTemplateDto): Promise<FormTemplate> {
    return this.formTemplateRepository.createTemplate(createFormTemplateDto);
  }
 
  // Method to get all form templates
  async getAll(): Promise<FormTemplate[]> {
    return this.formTemplateRepository.find();
  }
}
