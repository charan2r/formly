/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './create-form-template.dto';
import { FormTemplate } from '../model/form-template.entity';

interface MetaSchemaResponse<T> {
  status: string;
  message: string;
  data?: T;
}

@Controller('form-templates')
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) {}


  // API endpoint to create templates
  @Post('create')
  async createFormTemplate(@Body() createFormTemplateDto: CreateFormTemplateDto): Promise<FormTemplate> {
    return this.formTemplateService.createTemplate(createFormTemplateDto);
  }


  // API endpoint to get all form templates
  @Get()
  async getAll(): Promise<MetaSchemaResponse<FormTemplate[]>> {
    const templates = await this.formTemplateService.getAll();
    return {
      status: 'success',
      message: 'Form templates retrieved successfully',
      data: templates,
    };
  }
}


