/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
  async getOptions(@Body('formFieldId') formFieldId: string): Promise<MetaSchemaResponse<FormFieldsOption[]>> {
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
}
