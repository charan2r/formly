import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  /*describe('createCategory', () => {
    it('should create and save a new category', async () => {
      const categoryDto: CreateCategoryDto = { name: 'Test Category', description: 'A test category', createdById: 'user-uuid' };
      const createdCategory: Category = { id: 'uuid', ...categoryDto };

      jest.spyOn(categoryRepository, 'create').mockReturnValue(createdCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(createdCategory);

      expect(await categoryService.createCategory(categoryDto)).toEqual(createdCategory);
      expect(categoryRepository.create).toHaveBeenCalledWith(categoryDto);
      expect(categoryRepository.save).toHaveBeenCalledWith(createdCategory);
    });
  });*/
});
