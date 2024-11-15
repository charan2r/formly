/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FormTemplateRepository } from './form-template.repository';
import { CreateFormTemplateDto } from './create-form-template.dto';
import { FormTemplate } from '../model/form-template.entity';
import { UpdateTemplateDto } from './update-template.dto';
import { In } from 'typeorm';

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

  // Method to get a form template by ID
  async findOne(id: string): Promise<FormTemplate | undefined> {
    return this.formTemplateRepository.findOne({ where: { formTemplateId: id } });
  }

  // Method to update a form template
  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<FormTemplate | null> {
    const template = await this.formTemplateRepository.findOne({ where: { formTemplateId: id } });
    if (!template) {
      throw new NotFoundException(`Template not found`);
    }
    Object.assign(template, updateTemplateDto); 
    return this.formTemplateRepository.save(template);
  }

  // Method to delete a form template
  async softDelete(id: string): Promise<FormTemplate | null> {
    const template = await this.formTemplateRepository.findOne({ where: { formTemplateId: id } });
    if (!template) {
      throw new NotFoundException(`Template not found`);
    }
    template.status = 'deleted';  
    return this.formTemplateRepository.save(template);
  }

  // Method to bulk delete form templates
  async bulkDelete(ids: string[]): Promise<FormTemplate[]> {
    const templates = await this.formTemplateRepository.find({ where: { formTemplateId: In(ids) } });
    if (!templates.length) {
      throw new NotFoundException(`Templates not found`);
    }
    templates.forEach((template) => {
      template.status = 'deleted';
    });
    return this.formTemplateRepository.save(templates);
    
  }


}
