import { Injectable, NotFoundException} from '@nestjs/common';
import { Category } from '../model/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryRepository } from './category.repository';
import { UserRepository } from '../user/user.repository';
import { In } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository, 
  ) {}


  // create a category
  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    const { name, description,createdById } = createCategoryDto;

    // Find the user by ID (using createdById)
    const user = await this.userRepository.findOne({ where: { id: createdById } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new category and associate the user
    const newCategory = this.categoryRepository.create({
      name,
      description,
      createdById: user.id,
      createdAt: new Date(),
    });

    // Save the new category to the database
    const savedCategory = await this.categoryRepository.save(newCategory);

    // Return the saved category along with user first and last name
    return {
      ...savedCategory,
      createdBy: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  // Get a single category by ID
  async getCategoryById(categoryId: string): Promise<{ categoryId: string, name: string, description: string, createdBy: { firstName: string, lastName: string }, createdById: string, createdAt: Date }> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
      relations: ['createdBy'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

     return {
      categoryId: category.categoryId,
      name: category.name,
      description: category.description,
      createdById: category.createdById,
      createdBy: {
        firstName: category.createdBy?.firstName,
        lastName: category.createdBy?.lastName,
      },
      createdAt: category.createdAt,
    };
  }

  // Get all categories
  async getAllCategories(): Promise<{ categoryId: string, name: string, description: string, createdBy: { firstName: string, lastName: string }, createdAt: Date }[]> {
    const categories = await this.categoryRepository.find({
      relations: ['createdBy'],
    });

    return categories.map(({ categoryId, name, description, createdBy, createdAt }) => ({
      name,
      description,
      categoryId,
      createdBy: {
        firstName: createdBy?.firstName,
        lastName: createdBy?.lastName,
      },
      createdAt,
    }));
  }

  // update category
  async updateCategory(categoryId: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {

    const category = await this.categoryRepository.findOne({ where: { categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = { ...category, ...updateCategoryDto };

    updatedCategory.createdById = category.createdById;
    
    return this.categoryRepository.save(updatedCategory);
  }

  // Delete a single category
  async deleteCategory(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);
  }

   // Bulk delete categories
   async deleteCategories(categoryIds: string[]): Promise<void> {
    const categories = await this.categoryRepository.findBy({
      categoryId: In(categoryIds),
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    await this.categoryRepository.remove(categories);
  }

}

