import { Test, TestingModule } from '@nestjs/testing';
import { FormFieldsOptionsService } from './form-fields-options.service';

describe('FormFieldsOptionsService', () => {
  let service: FormFieldsOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormFieldsOptionsService],
    }).compile();

    service = module.get<FormFieldsOptionsService>(FormFieldsOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
