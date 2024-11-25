/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FormFieldsOption } from '../model/form-fields-option.entity';
import { CreateFormFieldsOptionDto } from './create-form-fields-option.dto';
import { FormFieldsOptionsRepository } from './form-fields-options.repository';
import { FormFieldsRepository } from '../form-fields/form-fields.repository';
import { In, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FormFieldsOptionsService {
    constructor(
        @InjectRepository(FormFieldsOption)
        private formFieldsOptionRepository: Repository<FormFieldsOption>,
    ) {}
    
    // Service method to add an option to a form field
    async addOption(
        createFormFieldsOptionDto: CreateFormFieldsOptionDto,
    ) {
        const newOption = this.formFieldsOptionRepository.create({
            option: createFormFieldsOptionDto.option,
            formField: { fieldId: createFormFieldsOptionDto.formFieldId },
        });

        return await this.formFieldsOptionRepository.save(newOption);
    }

    // Service method to get all options of a form field
    async getOptions(formFieldId: string): Promise<FormFieldsOption[]> {
        return await this.formFieldsOptionRepository.find({
            where: { formField: { fieldId: formFieldId }, status: 'active'},
            order: { option: 'ASC' },
        });
    }

    // Service method to get an option by its ID
    async getOptionById(optionId: string): Promise<FormFieldsOption> {
        return this.formFieldsOptionRepository.findOne({ 
            where: { 
                formFieldsOptionId: optionId,
            } 
        });
    }

    // Service method to update an option
    async updateOption(
        optionId: string,
        updateData: { option: string; formFieldId: string },
    ): Promise<FormFieldsOption> {
        const option = await this.formFieldsOptionRepository.findOne({
            where: { formFieldsOptionId: optionId }
        });

        if (!option) {
            throw new NotFoundException(`Option with ID ${optionId} not found`);
        }

        // Update the option
        option.option = updateData.option;

        // Save and return the updated option
        return await this.formFieldsOptionRepository.save(option);
    }

    // Service method to delete an option
    async deleteOption(optionId: string): Promise<void> {
        const option = await this.formFieldsOptionRepository.findOne({ where: { formFieldsOptionId: optionId } });
        if (!option) {
            throw new NotFoundException('Option not found');
        }
        option.status = 'deleted';
        await this.formFieldsOptionRepository.save(option);
    }

    // Service method to soft bulk delete options
    async bulkDeleteOptions(optionIds: string[]): Promise<void> {
        const options = await this.formFieldsOptionRepository.find({ where: { formFieldsOptionId: In(optionIds) } });
        options.forEach(option => {
            option.status = 'deleted';
        });
        await this.formFieldsOptionRepository.save(options);
    }
}


