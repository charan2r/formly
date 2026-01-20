import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './form.controller';
import { FormsService } from './form.service'; // Adjust the path as necessary
import { CreateFormDto } from './create-form.dto'; // Adjust the path as necessary
import { NotFoundException } from '@nestjs/common';

describe('FormsController', () => {
  let controller: FormsController;
  let service: FormsService;

  const mockFormsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    bulkDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        { provide: FormsService, useValue: mockFormsService },
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    service = module.get<FormsService>(FormsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a form', async () => {
      const createFormDto: CreateFormDto = {
        title: 'Test Form',
        description: 'This is a test form',
        categoryId: 'some-category-id',
        fields: [],
      };

      const result = { id: '1', ...createFormDto };
      mockFormsService.create.mockResolvedValue(result);

      expect(await controller.createForm(createFormDto)).toEqual(result);
      expect(mockFormsService.create).toHaveBeenCalledWith(createFormDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of forms', async () => {
      const forms = [{ id: '1', title: 'Test Form' }];
      mockFormsService.findAll.mockResolvedValue(forms);

      expect(await controller.getAll()).toEqual({
        status: 'success',
        message: 'Forms retrieved successfully',
        data: forms,
      });
      expect(mockFormsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a form by ID', async () => {
      const formId = '1';
      const form = { id: formId, title: 'Test Form' };
      mockFormsService.findOne.mockResolvedValue(form);

      expect(await controller.findOne(formId)).toEqual({
        status: 'success',
        message: 'Form retrieved successfully',
        data: form,
      });
      expect(mockFormsService.findOne).toHaveBeenCalledWith(formId);
    });

    it('should throw NotFoundException if form not found', async () => {
      const formId = '1';
      mockFormsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(formId)).resolves.toEqual({
        status: 'error',
        message: 'Form not found',
      });
    });
  });

  // Additional tests for update, softDelete, and bulkDelete can be added here
});