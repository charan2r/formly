/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FormField} from 'src/model/form-fields.entity';
//import { CreateFormFieldDto } from './create-form-field.dto';

@Injectable()
export class FormFieldsRepository extends Repository<FormField> {
  
  constructor(private dataSource: DataSource) {
    super(FormField, dataSource.createEntityManager());
  }

  
}