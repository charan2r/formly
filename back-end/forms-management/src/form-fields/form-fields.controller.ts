/* eslint-disable prettier/prettier */
import {Controller, Body, Post} from '@nestjs/common';
import { FormFieldsService } from '../form-fields/form-fields.service';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';
import { FormField } from '../model/form-fields.entity';

@Controller('form-fields')
export class FormFieldsController {
  constructor(private readonly formFieldsService: FormFieldsService) {}

  // API Endpoint To create a new form field
 @Post()
  async addField(@Body() createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
    return this.formFieldsService.addField(createFormFieldDto);
  }
}
