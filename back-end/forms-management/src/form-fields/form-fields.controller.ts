/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, UseGuards, Body, Post, Get, Query, Delete, Patch } from '@nestjs/common';
import { FormFieldsService } from '../form-fields/form-fields.service';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';
import { FormField } from '../model/form-fields.entity';
import { UpdateFormFieldDto } from './update-form-field.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/user/decorators/permissions.decorator';
import { Roles } from 'src/user/roles.decorator';
interface MetaSchemaResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

@Controller('form-fields')
@UseGuards(AuthGuard('jwt')) // Protect all routes with JWT authentication
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  // API Endpoint to create a new form field
  @Post('create')
  @Roles("Admin","SubUser")
  @Permissions("Create Template")
  async addField(@Body() createFormFieldDto: CreateFormFieldDto): Promise<MetaSchemaResponse<FormField>> {
    const field = await this.formFieldsService.addField(createFormFieldDto);
    return {
      success: true,
      message: 'Form field created successfully.',
      data: field,
    };
  }

  // API endpoint to get all form fields by template ID
  @Get()
  @Roles("Admin","SubUser")
  @Permissions("View Template", "View Form")
  async getFields(@Query('formTemplateId') formTemplateId: string): Promise<MetaSchemaResponse<FormField[]>> {
    const fields = await this.formFieldsService.getFields(formTemplateId);
    return {
      success: true,
      message: 'Form fields retrieved successfully.',
      data: fields,
    };
  }

  // API endpoint to get a form field by id
  @Get('details')
  @Roles("Admin","SubUser")
  @Permissions("View Template", "View Form")
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
  @Roles("Admin","SubUser")
  @Permissions("Edit Template")
  async deleteField(@Query('id') fieldId: string): Promise<MetaSchemaResponse<null>> {
    await this.formFieldsService.deleteField(fieldId);
    return {
      success: true,
      message: 'Form field deleted successfully.',
    };
  }

  // API endpoint to bulk delete form fields
  @Delete('bulk-delete')
  @Roles("Admin","SubUser")
  @Permissions("Edit Template")
  async bulkDeleteFields(@Body('ids') fieldIds: string[]): Promise<MetaSchemaResponse<null>> {
    await this.formFieldsService.bulkDeleteFields(fieldIds);
    return {
      success: true,
      message: 'Form fields deleted successfully.',
    };
  }

  // API endpoint to update a form field
  @Patch('update')
  @Roles("Admin","SubUser")
  @Permissions("Edit Template")
  async updateField(@Query('id') fieldId: string, @Body() updateFormFieldDto: UpdateFormFieldDto): Promise<MetaSchemaResponse<FormField>> {
    const field = await this.formFieldsService.updateField(fieldId, updateFormFieldDto);
    return {
      success: true,
      message: 'Form field updated successfully.',
      data: field,
    };
  }
}
