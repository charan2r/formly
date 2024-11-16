/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../model/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
