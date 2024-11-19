/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { FormFieldsService } from './form-fields.service';
import { CreateFormFieldDto } from './create-form-field.dto';
import { FormField } from 'src/model/form-fields.entity';

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  // API Endpoint To create a new form field
  @Post('create')
  async addField(@Body() createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    return this.formFieldsService.addField(createFormFieldDto);
  }
}
