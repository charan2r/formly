/* eslint-disable prettier/prettier */
// src/forms/forms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from '../model/form.entity'; 
import { FormsService } from './form.service';
import { FormsController } from './form.controller';
import { FormsRepository } from './form.repository'; 
import { CategoryModule } from 'src/category/category.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormsRepository]), CategoryModule],
  controllers: [FormsController],
  providers: [FormsService, FormsRepository],
})
export class FormsModule {}