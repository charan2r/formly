/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FormFieldsOption } from '../model/form-fields-option.entity';
import { CreateFormFieldsOptionDto } from './create-form-fields-option.dto';
import { FormFieldsOptionsRepository } from './form-fields-options.repository';
import { FormFieldsRepository } from '../form-fields/form-fields.repository';

@Injectable()
export class FormFieldsOptionsService {
    constructor(
        private readonly formFieldsOptionsRepository: FormFieldsOptionsRepository,
        private readonly formFieldsRepository: FormFieldsRepository,
    ) {}
    
    // Service method to add an option to a form field
    async addOption(
        createFormFieldsOptionDto: CreateFormFieldsOptionDto,
    ): Promise<FormFieldsOption> {
        const { formFieldId } = createFormFieldsOptionDto;
        const formField = await this.formFieldsRepository.findOne({ where: { fieldId: formFieldId } });
        if (!formField) {
        throw new NotFoundException('Form Field not found');
        }
        const option = this.formFieldsOptionsRepository.create(createFormFieldsOptionDto);
        option.formField = formField;
        return this.formFieldsOptionsRepository.save(option);
    }

    // Service method to get all options of a form field
    async getOptions(formFieldId: string): Promise<FormFieldsOption[]> {
        return this.formFieldsOptionsRepository.find({ where: { formField: { fieldId: formFieldId } } });
    }

    // Service method to get an option by its ID
    async getOptionById(optionId: string): Promise<FormFieldsOption> {
        return this.formFieldsOptionsRepository.findOne({ where: { formFieldsOptionId: optionId } });
    }
}


