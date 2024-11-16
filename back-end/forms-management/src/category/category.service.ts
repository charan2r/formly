import { Injectable, NotFoundException} from '@nestjs/common';
import { Category } from '../model/category.entity';
import { CreateCategoryDto } from 'src/dto/Create-Category.dto';
import { CategoryRepository } from './category.repository';
import { UserRepository } from '../user/user.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { In } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly organizationRepository: OrganizationRepository, 
  ) {}


  // create a category
  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    const { name, description, createdById } = createCategoryDto;

    // Find the user by ID (using createdById)
    const user = await this.organizationRepository.findOne({
      where: { orgId: createdById },
    });
    if (!user) {
      throw new Error('Organization not found');
    }

    // Create a new category and associate the user
    const newCategory = this.categoryRepository.create({
      name,
      description,
      createdById: user.orgId,
      createdAt: new Date(),
      status: 'active',
    });

    // Save the new category to the database
    const savedCategory = await this.categoryRepository.save(newCategory);

    // Return the saved category along with user first and last name
    return {
      ...savedCategory
    };
  }

  // Get a single category by ID
  async getCategoryById(categoryId: string): Promise<{
    categoryId: string;
    name: string;
    description: string;
    // createdBy: { firstName: string; lastName: string };
    createdById: string;
    createdAt: Date;
    status: string;
  }> {
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
      createdAt: category.createdAt,
      status: category.status,
    };
  }

  // Get all categories
  async getAllCategories() {
    const categories = await this.categoryRepository.find({
      relations: ['createdBy'], // Ensure related entities are fetched
    });
  
    return categories.map(({ categoryId, name, description, createdAt, status }) => ({
      categoryId,
      name,
      description,
      createdAt,
      status,
    }));
  }

  async getCategoriesByOrganization(organizationId: string) {
    const categories = await this.categoryRepository.find({
      where: { organization: { orgId: organizationId } }, // Use relations to filter by organization
      relations: ['organization'], // Ensures the relationship is loaded
    });

    if (!categories.length) {
      throw new NotFoundException(`No categories found for organization ID ${organizationId}`);
    }

    return categories.map(({ categoryId, name, description, createdAt, status }) => ({
      categoryId,
      name,
      description,
      createdAt,
      status,
    }));
  }

  // update category
  async updateCategory(categoryId: string, updateCategoryDto: CreateCategoryDto) {

    const category = await this.categoryRepository.findOne({ where: { categoryId } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = { ...category, ...updateCategoryDto };

    updatedCategory.createdById = category.createdById;
    
    return this.categoryRepository.save(updatedCategory);
  }

  // Delete a single category
  async deleteCategory(categoryId: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });
  
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  
    category.status = 'deleted';
    await this.categoryRepository.save(category);
    return true;
  }

   // Bulk delete categories
   async deleteCategories(categoryIds: string[]): Promise<boolean> {
    const categories = await this.categoryRepository.find({
      where: { categoryId: In(categoryIds) },
    });
  
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }
  
    categories.forEach(category => category.status = 'deleted');
  
    await this.categoryRepository.save(categories);
    return true;
  }

}

