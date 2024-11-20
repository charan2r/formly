/* eslint-disable prettier/prettier */
import {Controller, Body, Post, Get, Query} from '@nestjs/common';
import { FormFieldsService } from '../form-fields/form-fields.service';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';
import { FormField } from '../model/form-fields.entity';

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  // API Endpoint To create a new form field
 @Post('create')
  async addField(@Body() createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    return this.formFieldsService.addField(createFormFieldDto);
  }

  // API endpoint to get all form fields
  @Get()
  async getFields(): Promise<FormField[]> {
    return this.formFieldsService.getFields();
  }

  // API endpoint to get a form field by id
  @Get('details')
  async getFieldById(@Query('id') fieldId: string): Promise<FormField> {
    return this.formFieldsService.getFieldById(fieldId);
  }
}