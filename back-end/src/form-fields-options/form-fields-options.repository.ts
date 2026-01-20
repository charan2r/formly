/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FormFieldsOption } from '../model/form-fields-option.entity';

@Injectable()
export class FormFieldsOptionsRepository extends Repository<FormFieldsOption> {
  
  constructor(private dataSource: DataSource) {
    super(FormFieldsOption, dataSource.createEntityManager());
  }

  
}