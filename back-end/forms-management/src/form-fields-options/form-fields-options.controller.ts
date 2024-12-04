/* eslint-disable prettier/prettier */
import { Body, Controller, UseGuards, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { FormFieldsOption } from '../model/form-fields-option.entity';
import { CreateFormFieldsOptionDto } from './create-form-fields-option.dto';
import { FormFieldsOptionsService } from './form-fields-options.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/user/roles.decorator';
import { Permissions } from 'src/user/permissions.decorator';

interface MetaSchemaResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
  }

// Create a DTO for update option
export class UpdateOptionDto {
  @ApiProperty({ description: 'ID of the option to update' })
  optionId: string;

  @ApiProperty({ description: 'New option content' })
  option: string;

  @ApiProperty({ description: 'ID of the form field this option belongs to' })
  formFieldId: string;
}

@Controller('form-fields-options')
@UseGuards(AuthGuard('jwt'))
export class FormFieldsOptionsController {
    constructor(private readonly formFieldsOptionsService: FormFieldsOptionsService) {}
    
    // API Endpoint to add an option to a form field
  @Post('create')
  @Roles("Admin","SubUser")
  @Permissions("add feild option")
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
  @Roles("Admin","SubUser")
  @Permissions("view feild options")
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
  @Roles("Admin","SubUser")
  @Permissions("view feild option")
  async getOptionById(@Query('optionId') optionId: string): Promise<MetaSchemaResponse<FormFieldsOption>> {
    const option = await this.formFieldsOptionsService.getOptionById(optionId);
    return {
      success: true,
      message: 'Option retrieved successfully.',
      data: option,
    };
  }

  @ApiOperation({ summary: 'Update an option' })
  @ApiResponse({ status: 200, description: 'Option updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: UpdateOptionDto })
  @Patch('update')
  @Roles("Admin","SubUser")
  @Permissions("edit feild options")
  async updateOption(
    @Body() updateData: UpdateOptionDto,
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
  @Roles("Admin","SubUser")
  @Permissions("delete feild option")
  async deleteOption(@Query('optionId') optionId: string): Promise<MetaSchemaResponse> {
    await this.formFieldsOptionsService.deleteOption(optionId);
    return {
      success: true,
      message: 'Option deleted successfully.',
    };
  }

  // API Endpoint to soft bulk delete options
  @Delete('bulk-delete')
  @Roles("Admin","SubUser")
  @Permissions("delete feild options")
  async bulkDeleteOptions(@Body('optionIds') optionIds: string[]): Promise<MetaSchemaResponse> {
    await this.formFieldsOptionsService.bulkDeleteOptions(optionIds);
    return {
      success: true,
      message: 'Options deleted successfully.',
    };
  }

 
}
