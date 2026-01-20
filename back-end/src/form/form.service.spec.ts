import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './form.service';
import { FormsRepository } from './form.repository'; // Adjust the path as necessary
import { CreateFormDto } from './create-form.dto'; // Adjust the path as necessary
import { NotFoundException } from '@nestjs/common';

describe('FormsService', () => {
  let service: FormsService;
  let repository: FormsRepository;

  const mockFormsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        { provide: FormsRepository, useValue: mockFormsRepository },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    repository = module.get<FormsRepository>(FormsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a form', async () => {
      const createFormDto: CreateFormDto = {
        title: 'Test Form',
        description: 'This is a test form',
        categoryId: 'some-category-id',
        fields: [],
      };

      const savedForm = { id: '1', ...createFormDto };
      mockFormsRepository.create.mockReturnValue(savedForm);
      mockFormsRepository.save.mockResolvedValue(savedForm);

      const result = await service.create(createFormDto);
      expect(result).toEqual(savedForm);
      expect(mockFormsRepository.create).toHaveBeenCalledWith(createFormDto);
      expect(mockFormsRepository.save).toHaveBeenCalledWith(savedForm);
    });
  });

  describe('findAll', () => {
    it('should return an array of forms', async () => {
      const forms = [{ id: '1', title: 'Test Form' }];
      mockFormsRepository.find.mockResolvedValue(forms);

      const result = await service.findAll();
      expect(result).toEqual(forms);
      expect(mockFormsRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a form by ID', async () => {
      const formId = '1';
      const form = { id: formId, title: 'Test Form' };
      mockFormsRepository.findOne.mockResolvedValue(form);

      const result = await service.findOne(formId);
      expect(result).toEqual(form);
      expect(mockFormsRepository.findOne).toHaveBeenCalledWith({ where: { formId } });
    });

    it('should throw NotFoundException if form not found', async () => {
      const formId = '1';
      mockFormsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(formId)).rejects.toThrow(NotFoundException);
    });
  });

  // Additional tests for update, softDelete, and bulkDelete can be added here
});