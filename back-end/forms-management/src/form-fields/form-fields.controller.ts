/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Body, Post, Get, Query, Delete, Patch } from '@nestjs/common';
import { FormFieldsService } from '../form-fields/form-fields.service';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';
import { FormField } from '../model/form-fields.entity';
import { UpdateFormFieldDto } from './update-form-field.dto';
interface MetaSchemaResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  // API Endpoint to create a new form field
  @Post('create')
  async addField(@Body() createFormFieldDto: CreateFormFieldDto): Promise<MetaSchemaResponse<FormField>> {
    const field = await this.formFieldsService.addField(createFormFieldDto);
    return {
      success: true,
      message: 'Form field created successfully.',
      data: field,
    };
  }

  // API endpoint to get all form fields
  @Get()
  async getFields(): Promise<MetaSchemaResponse<FormField[]>> {
    const fields = await this.formFieldsService.getFields();
    return {
      success: true,
      message: 'Form fields retrieved successfully.',
      data: fields,
    };
  }

  // API endpoint to get a form field by id
  @Get('details')
  async getFieldById(@Query('id') fieldId: string): Promise<MetaSchemaResponse<FormField>> {
    const field = await this.formFieldsService.getFieldById(fieldId);
    return {
      success: true,
      message: `Form field retrieved successfully.`,
      data: field,
    };
  }

  // API endpoint to delete a form field
  @Delete('delete')
  async deleteField(@Query('id') fieldId: string): Promise<MetaSchemaResponse<null>> {
    await this.formFieldsService.deleteField(fieldId);
    return {
      success: true,
      message: 'Form field deleted successfully.',
    };
  }

  // API endpoint to bulk delete form fields
  @Delete('bulk-delete')
  async bulkDeleteFields(@Body('ids') fieldIds: string[]): Promise<MetaSchemaResponse<null>> {
    await this.formFieldsService.bulkDeleteFields(fieldIds);
    return {
      success: true,
      message: 'Form fields deleted successfully.',
    };
  }

  // API endpoint to update a form field
  @Patch('update')
  async updateField(@Query('id') fieldId: string, @Body() updateFormFieldDto: UpdateFormFieldDto): Promise<MetaSchemaResponse<FormField>> {
    const field = await this.formFieldsService.updateField(fieldId, updateFormFieldDto);
    return {
      success: true,
      message: 'Form field updated successfully.',
      data: field,
    };
  }
}
