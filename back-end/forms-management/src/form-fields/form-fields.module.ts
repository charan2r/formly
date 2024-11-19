/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormField } from 'src/model/form-fields.entity';
import { FormFieldsController } from './form-fields.controller';
import { FormFieldsService } from './form-fields.service';
import { FormFieldsRepository } from './form-fields.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FormField, FormFieldsRepository])],
  controllers: [FormFieldsController],
  providers: [FormFieldsService, FormFieldsRepository],
})
export class FormFieldsModule {}
