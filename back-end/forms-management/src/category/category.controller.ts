/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../user/Create-Category.dto';
import { Category } from '../model/category.entity';
import { Roles } from 'src/user/roles.decorator';
import { RolesGuard } from 'src/user/roles.guard';
import { AuthGuard } from '@nestjs/passport';

interface CategoryResponse {
  categoryId: string;
  name: string;
  description: string;
  createdAt: Date;
  status: string;
}

@UseGuards(AuthGuard('jwt'),RolesGuard) // Protect all routes with JWT authentication
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
    
    // Create a category
  @Roles("Admin","SubUser")
  
  @Post('create')
  async addCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<{ status: string; message: string; data: CategoryResponse }> {
    const category = await this.categoryService.create(createCategoryDto);
    return {
      status: 'success',
      message: 'Category created successfully',
      data: category,
    };
  }

  @Get('organization/:orgId')
  async getCategoriesByOrganization(
    @Param('orgId') organizationId: string,
  ): Promise<{ status: string; message: string; data: CategoryResponse[] }> {
    const categories = await this.categoryService.getCategoriesByOrganization(organizationId);
    return {
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories,
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

  // Delete a single category
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string): Promise<{ status: string; message: string }> {
    await this.categoryService.deleteCategory(id);
    return {
      status: 'success',
      message: 'Category deleted successfully',
    };
  }

  // Bulk delete categories
  @Delete('bulk-delete')
  async deleteCategories(@Body() categoryIds: string[]): Promise<{ status: string; message: string }> {
    await this.categoryService.deleteCategories(categoryIds);
    return {
      status: 'success',
      message: 'Categories deleted successfully',
    };
  }

}