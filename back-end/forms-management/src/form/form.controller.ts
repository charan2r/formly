/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query, Patch, NotFoundException, Delete } from '@nestjs/common';
import { FormsService } from './form.service';
import { CreateFormDto } from './create-form.dto'; 
import { Form } from '../model/form.entity'; 
import { UpdateFormDto } from './update-form.dto'; // Create this DTO

interface MetaSchemaResponse<T> {
  status: string;
  message: string;
  data?: T;
}

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // API endpoint to create forms
  @Post('create')
  async createForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formsService.create(createFormDto);
  }

  // API endpoint to get all forms
  @Get()
  async getAll(): Promise<MetaSchemaResponse<Form[]>> {
    const forms = await this.formsService.findAll();
    return {
      status: 'success',
      message: 'Forms retrieved successfully',
      data: forms,
    };
  }

  // API endpoint to get a form by ID
  @Get('details')
  async findOne(@Query('id') formId: string): Promise<MetaSchemaResponse<Form | undefined>> {
    const form = await this.formsService.findOne(formId);
    if (!form) {
      return {
        status: 'error',
        message: 'Form not found',
      };
    }
    return {
      status: 'success',
      message: 'Form retrieved successfully',
      data: form,
    };
  }

  // API endpoint to update a form
  @Patch('edit')
  async updateForm(
    @Query('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ): Promise<MetaSchemaResponse<Form>> {
    const updatedForm = await this.formsService.update(id, updateFormDto);
    if (!updatedForm) {
      throw new NotFoundException(`Form not found`);
    }
    return {
      status: 'success',
      message: 'Form updated successfully',
      data: updatedForm,
    };
  }

  // API endpoint to delete a form
  @Delete('delete')
  async softDelete(@Query('id') id: string): Promise<MetaSchemaResponse<Form>> {
    const deletedForm = await this.formsService.softDelete(id);
    if (!deletedForm) {
      throw new NotFoundException(`Form not found`);
    }
    return {
      status: 'success',
      message: 'Form deleted successfully',
      data: deletedForm,
    };
  }

  // API endpoint to bulk delete forms
  @Delete('bulk-delete')
  async bulkDelete(@Body('ids') ids: string[]): Promise<MetaSchemaResponse<null>> {
    const deletedForms = await this.formsService.bulkDelete(ids);
    if (!deletedForms.length) {
      throw new NotFoundException(`Forms not found`);
    }
    return {
      status: 'success',
      message: 'Forms deleted successfully',
    };
  }
}