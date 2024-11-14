// src/category/category.service.ts
import { Injectable} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryRepository } from './category.repository';
import { UserRepository } from '../user/user.repository';



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
}

