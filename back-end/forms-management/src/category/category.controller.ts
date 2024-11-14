import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../model/category.entity';


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

  // Get a single category by ID
  @Get('details/:id')
  async getCategoryById(@Param('id') id: string): Promise<{ status: string; message: string; data: CategoryResponse }> {
    const category = await this.categoryService.getCategoryById(id);
    return {
      status: 'success',
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  // Get all categories
  @Get('all')
  async getAllCategories(): Promise<{ status: string; message: string; data: CategoryResponse[] }> {
    const categories = await this.categoryService.getAllCategories();
    return {
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories,
    };
  } 

  // update/edit 
  @Patch('update/:id')
   async updateCategory(
     @Param('id') id: string,
     @Body() updateCategoryDto: CreateCategoryDto,
     ): Promise<{ status: string; message: string; data: Category }> {
     const updatedCategory = await this.categoryService.updateCategory(id, updateCategoryDto); 
     return {
       status: 'success',
       message: 'Category updated successfully',
       data: updatedCategory,
     };
  }

}