import { Injectable, NotFoundException } from '@nestjs/common';
import { FormsRepository } from './form.repository';
import { CreateFormDto } from './create-form.dto'; // Adjust the path as necessary
import { Form } from '../model/form.entity'; // Adjust the path as necessary
import { UpdateFormDto } from './update-form.dto';
import { In } from 'typeorm'; // Import the In operator

@Injectable()
export class FormsService {
  constructor(private readonly formsRepository: FormsRepository) {}

  // Method to create a form
  async create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formsRepository.create({
      name: createFormDto.name,
      status: createFormDto.status || 'active', // Default status if not provided
      formTemplate: { formId: createFormDto.formTemplateId } as any, // Assuming formTemplate is a relation
    });
    return this.formsRepository.save(form);
  }

  // Method to get all forms
  async findAll(): Promise<Form[]> {
    return this.formsRepository.find();
  }

  // Method to get a form by ID
  async findOne(id: string): Promise<Form | undefined> {
    return this.formsRepository.findOne({ where: { formId: id } }); // Adjust the field name as necessary
  }

  // Method to update a form
  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form | null> {
    const form = await this.formsRepository.findOne({ where: { formId: id } }); // Adjust the field name as necessary
    if (!form) {
      throw new NotFoundException(`Form not found`);
    }
    Object.assign(form, updateFormDto);
    return this.formsRepository.save(form);
  }

  // Method to delete a form
  async softDelete(id: string): Promise<Form | null> {
    const form = await this.formsRepository.findOne({ where: { formId: id } }); // Adjust the field name as necessary
    if (!form) {
      throw new NotFoundException(`Form not found`);
    }
    form.status = 'deleted'; // Assuming you have a status field
    return this.formsRepository.save(form);
  }

  // Method to bulk delete forms
  async bulkDelete(ids: string[]): Promise<Form[]> {
    const forms = await this.formsRepository.find({ where: { formId: In(ids) } }); // Adjust the field name as necessary
    if (!forms.length) {
      throw new NotFoundException(`Forms not found`);
    }
    forms.forEach((form) => {
      form.status = 'deleted'; // Assuming you have a status field
    });
    return this.formsRepository.save(forms);
  }
}