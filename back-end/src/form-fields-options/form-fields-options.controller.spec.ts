import { Test, TestingModule } from '@nestjs/testing';
import { FormFieldsOptionsController } from './form-fields-options.controller';

describe('FormFieldsOptionsController', () => {
  let controller: FormFieldsOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormFieldsOptionsController],
    }).compile();

    controller = module.get<FormFieldsOptionsController>(FormFieldsOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
