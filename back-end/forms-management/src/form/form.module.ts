/* eslint-disable prettier/prettier */
// src/forms/forms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from '../model/form.entity'; // Adjust the path as necessary
import { FormsService } from './form.service';
import { FormsController } from './form.controller';
import { FormsRepository } from './form.repository'; // Create this repository
import { CategoryModule } from 'src/category/category.module'; // If needed

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormsRepository]), CategoryModule],
  controllers: [FormsController],
  providers: [FormsService, FormsRepository],
})
export class FormsModule {}