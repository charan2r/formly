/* eslint-disable prettier/prettier */
import { Controller, UseGuards, Post, Body, Get, Query, Patch, NotFoundException, Delete } from '@nestjs/common';
import { FormTemplateService } from './form-template.service';
import { CreateFormTemplateDto } from './create-form-template.dto';
import { FormTemplate } from '../model/form-template.entity';
import { UpdateTemplateDto } from './update-template.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/user/roles.decorator';
import { Permissions } from 'src/user/permissions.decorator';

interface MetaSchemaResponse<T> {
  status: string;
  message: string;
  data?: T;
}

@Controller('form-templates')
//@UseGuards(AuthGuard('jwt')) // Protect all routes with JWT authentication
export class FormTemplateController {
  constructor(private readonly formTemplateService: FormTemplateService) {}


  // API endpoint to create templates
  @Post('create')
  @Roles("Admin","SubUser")
  @Permissions("Create Template")
  async createFormTemplate(@Body() createFormTemplateDto: CreateFormTemplateDto): Promise<FormTemplate> {
    console.log(createFormTemplateDto)
    return this.formTemplateService.createTemplate(createFormTemplateDto);
  }


  // API endpoint to get all form templates
  @Get()
  @Roles("Admin","SubUser")
  @Permissions("view Templates")
  async getAll(): Promise<MetaSchemaResponse<FormTemplate[]>> {
    const templates = await this.formTemplateService.getAll();
    return {
      status: 'success',
      message: 'Form templates retrieved successfully',
      data: templates,
    };
  }


  // API endpoint to get a form template by ID
  @Get('details')
  @Roles("Admin","SubUser")
  @Permissions("view Template")
  async findOne(@Query('id') formTemplateId: string): Promise<MetaSchemaResponse<FormTemplate | undefined>> {
    const template = await this.formTemplateService.findOne(formTemplateId);
    if (!template) {
      return {
        status: 'error',
        message: 'Form template not found',
      };
    }
    return {
      status: 'success',
      message: 'Form template retrieved successfully',
      data: template,
    };
  }



  // API endpoint to update a form template
  @Patch('edit')
  @Roles("Admin","SubUser")
  @Permissions("Edit Templates")
  async updateTemplate(
    @Query('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) : Promise<MetaSchemaResponse<FormTemplate>>{
    const updatedTemplate = await this.formTemplateService.update(id, updateTemplateDto);
    if (!updatedTemplate) {
      throw new NotFoundException(`Template not found`);
    }
    return {
      status: 'success',
      message: 'Form template updated successfully',
      data: updatedTemplate,
    }
  }

  // API endpoint to delete a form template
  @Delete('delete')
  @Roles("Admin","SubUser")
  @Permissions("Delete Template")
  async softDelete(@Query('id') id: string): Promise<MetaSchemaResponse<FormTemplate>> {
    const deletedTemplate = await this.formTemplateService.softDelete(id);
    if (!deletedTemplate) {
      throw new NotFoundException(`Template not found`);
    }
    return {
      status: 'success',
      message: 'Status of Form template changed successfully',
      data: deletedTemplate,
    };
  }

  // API endpoint to bulk delete form templates
  @Delete('bulk-delete')
  @Roles("Admin","SubUser")
  @Permissions("Delete Templates")
  async bulkDelete(@Body('ids') ids: string[]): Promise<MetaSchemaResponse<null>> {
    const deletedTemplates = await this.formTemplateService.bulkDelete(ids);
    if (!deletedTemplates.length) {
      throw new NotFoundException(`Templates not found`);
    }
    return {
      status: 'success',
      message: 'Status of Form templates changed successfully',
    };
  }
}