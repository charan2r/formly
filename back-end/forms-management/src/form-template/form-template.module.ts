/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from '../model/form-template.entity';
import { FormTemplateService } from './form-template.service';
import { FormTemplateController } from './form-template.controller';
import { FormTemplateRepository } from './form-template.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FormTemplate, FormTemplateRepository])],
  controllers: [FormTemplateController],
  providers: [FormTemplateService, FormTemplateRepository],
})
export class FormTemplateModule {}

