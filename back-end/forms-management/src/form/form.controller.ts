/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Query, Patch, NotFoundException, Delete, UseGuards } from '@nestjs/common';
import { FormsService } from './form.service';
import { CreateFormDto } from './create-form.dto'; 
import { Form } from '../model/form.entity'; 
import { UpdateFormDto } from './update-form.dto'; 
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/user/roles.decorator';
import { RolesGuard } from 'src/user/roles.guard';
import { Permissions } from 'src/user/permissions.decorator';

interface MetaSchemaResponse<T> {
  status: string;
  message: string;
  data?: T;
}

@Controller('forms')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('Admin', 'SubUser')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // API endpoint to create forms
  @Permissions('Create form')
  @Post('create')
  async createForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
    return this.formsService.create(createFormDto);
  }

  // API endpoint to get all forms
  @Get()
  @Permissions('View forms')
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
  @Permissions('View form')
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
  @Permissions('Edit form')
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
  @Permissions('Delete form')
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
  @Permissions('Delete form') 
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