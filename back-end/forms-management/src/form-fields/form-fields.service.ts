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
}

