/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { FormFieldsRepository } from '../form-fields/form-fields.repository';
import { FormField } from '../model/form-fields.entity';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';

@Injectable()
export class FormFieldsService {
    constructor(private readonly formFieldsRepository: FormFieldsRepository) {}

    // Method to create a new form field
    async addField(createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
        const field = this.formFieldsRepository.create(createFormFieldDto);
        return this.formFieldsRepository.save(field);
    }

    // Method to get all form fields
    async getFields(): Promise<FormField[]>{
        return this.formFieldsRepository.find();
    }

    // Method to get a form field by id
    async getFieldById(fieldId: string): Promise<FormField> {
        const field = await this.formFieldsRepository.findOne({ where: { fieldId } });
        if (!field) {
          throw new Error('Form Field not found');
        }
        return field;
    }
}

