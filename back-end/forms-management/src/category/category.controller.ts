import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

interface CategoryResponse {
  categoryId: string;
  name: string;
  description: string;
  createdBy: { firstName: string; lastName: string };
  createdAt: Date;
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
    
    // Create a category
  @Post('create')
  async addCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<{ status: string; message: string; data: CategoryResponse }> {
    const category = await this.categoryService.create(createCategoryDto);
    return {
      status: 'success',
      message: 'Category created successfully',
      data: category,
    };
  }

}