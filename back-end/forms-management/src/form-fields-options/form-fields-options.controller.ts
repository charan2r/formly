/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { FormFieldsOption } from '../model/form-fields-option.entity';
import { CreateFormFieldsOptionDto } from './create-form-fields-option.dto';
import { FormFieldsOptionsService } from './form-fields-options.service';

interface MetaSchemaResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
  }

@Controller('form-fields-options')
export class FormFieldsOptionsController {
    constructor(private readonly formFieldsOptionsService: FormFieldsOptionsService) {}
    
    // API Endpoint to add an option to a form field
  @Post('create')
  async addOption(@Body() createFormFieldsOptionDto: CreateFormFieldsOptionDto,
  ): Promise<MetaSchemaResponse<FormFieldsOption>> {
    const option = await this.formFieldsOptionsService.addOption(createFormFieldsOptionDto);
    return {
      success: true,
      message: 'Option added successfully.',
      data: option,
    };
  }

  // API Endpoint to get all options of a form field
  @Get()
  async getOptions(@Query('formFieldId') formFieldId: string): Promise<MetaSchemaResponse<FormFieldsOption[]>> {
    const options = await this.formFieldsOptionsService.getOptions(formFieldId);
    return {
      success: true,
      message: 'Options retrieved successfully.',
      data: options,
    };
  }

  // API Endpoint to get an option by its ID
  @Get('details')
  async getOptionById(@Query('optionId') optionId: string): Promise<MetaSchemaResponse<FormFieldsOption>> {
    const option = await this.formFieldsOptionsService.getOptionById(optionId);
    return {
      success: true,
      message: 'Option retrieved successfully.',
      data: option,
    };
  }

  // API Endpoint to update an option
  @Patch('update')
  async updateOption(
    @Body() updateData: { optionId: string; option: string; formFieldId: string },
  ): Promise<MetaSchemaResponse<FormFieldsOption>> {
    try {
      const option = await this.formFieldsOptionsService.updateOption(
        updateData.optionId,
        { option: updateData.option, formFieldId: updateData.formFieldId }
      );
      
      return {
        success: true,
        message: 'Option updated successfully.',
        data: option,
      };
    } catch (error) {
      console.error('Error updating option:', error);
      throw error;
    }
  }

  // API Endpoint to delete an option
  @Delete('delete')
  async deleteOption(@Query('optionId') optionId: string): Promise<MetaSchemaResponse> {
    await this.formFieldsOptionsService.deleteOption(optionId);
    return {
      success: true,
      message: 'Option deleted successfully.',
    };
  }

  // API Endpoint to soft bulk delete options
  @Delete('bulk-delete')
  async bulkDeleteOptions(@Body('optionIds') optionIds: string[]): Promise<MetaSchemaResponse> {
    await this.formFieldsOptionsService.bulkDeleteOptions(optionIds);
    return {
      success: true,
      message: 'Options deleted successfully.',
    };
  }

 
}
