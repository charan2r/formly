/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './create-form-template.dto';
import { FormTemplate } from '../model/form-template.entity';

@Controller('form-templates')
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) {}


  // API endpoint to create templates
  @Post('create')
  async createFormTemplate(@Body() createFormTemplateDto: CreateFormTemplateDto): Promise<FormTemplate> {
    return this.formTemplateService.createTemplate(createFormTemplateDto);
  }
}


