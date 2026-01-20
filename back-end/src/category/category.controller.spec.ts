import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });

 /* describe('addCategory', () => {
    it('should create a new category', async () => {
      const categoryDto: CreateCategoryDto = { name: 'Test Category', description: 'A test category', createdById: 'user-uuid' };
      const result: Category = { id: 'uuid', ...categoryDto };

      jest.spyOn(categoryService, 'createCategory').mockResolvedValue(result);

      expect(await categoryController.addCategory(categoryDto)).toEqual(result);
      expect(categoryService.createCategory).toHaveBeenCalledWith(categoryDto);
    });
  });*/
});