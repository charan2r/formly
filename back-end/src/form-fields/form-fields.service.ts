/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Not } from 'typeorm';
import { FormFieldsRepository } from '../form-fields/form-fields.repository';
import { FormField } from '../model/form-fields.entity';
import { CreateFormFieldDto } from '../form-fields/create-form-field.dto';
import { UpdateFormFieldDto } from './update-form-field.dto';

@Injectable()
export class FormFieldsService {
    constructor(private readonly formFieldsRepository: FormFieldsRepository) {}

    // Method to create a new form field
    async addField(createFormFieldDto: CreateFormFieldDto): Promise<FormField> {
        const field = this.formFieldsRepository.create(createFormFieldDto);
        return this.formFieldsRepository.save(field);
    }

    // Method to get all form fields by template ID
    async getFields(formTemplateId: string): Promise<FormField[]> {
        console.log("formTemplateId", formTemplateId);
        return this.formFieldsRepository.find({ 
            where: { 
                formTemplateId,
                status: 'active'
            } 
        });
    }

    // Method to get a form field by id
    async getFieldById(fieldId: string): Promise<FormField> {
        const field = await this.formFieldsRepository.findOne({ where: { fieldId } });
        if (!field) {
          throw new Error('Form Field not found');
        }
        return field;
    }

    // Method to delete a form field
    async deleteField(fieldId: string): Promise<void> {
        const field = await this.formFieldsRepository.findOne({ where: { fieldId } });
        if (!field) {
          throw new Error('Form Field not found');
        }
        field.status = 'deleted';
        await this.formFieldsRepository.save(field);
    }

    // Method to bulk delete form fields
    async bulkDeleteFields(fieldIds: string[]): Promise<void> {
        const fields = await this.formFieldsRepository.find({ where: { fieldId: In(fieldIds) } });
        if (fields.length === 0) {
            throw new NotFoundException('No form fields found for the given IDs');
          }
        fields.forEach(field => {
          field.status = 'deleted';
        });
        await this.formFieldsRepository.save(fields);
    }

    // Method to update a form field
    async updateField(fieldId: string, updateFormFieldDto: UpdateFormFieldDto): Promise<FormField> {
        const field = await this.formFieldsRepository.findOne({ where: { fieldId } });
        if (!field) {
          throw new Error('Form Field not found');
        }
        Object.assign(field, updateFormFieldDto);
        return this.formFieldsRepository.save(field);
    }
       
}

