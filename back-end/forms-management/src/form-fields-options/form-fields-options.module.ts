/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFieldsOption } from 'src/model/form-fields-option.entity';
import { FormFieldsOptionsRepository } from './form-fields-options.repository';
import { FormFieldsOptionsService } from './form-fields-options.service';
import { FormFieldsOptionsController } from './form-fields-options.controller';
import { FormFieldsModule } from 'src/form-fields/form-fields.module';

@Module({
    imports: [TypeOrmModule.forFeature([FormFieldsOption, FormFieldsOptionsRepository]), FormFieldsModule],
    controllers: [FormFieldsOptionsController],
    providers: [FormFieldsOptionsService, FormFieldsOptionsRepository],
})
export class FormFieldsOptionsModule {}
