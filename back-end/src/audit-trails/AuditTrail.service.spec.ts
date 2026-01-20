import { Test, TestingModule } from '@nestjs/testing';
import { AuditTrailService } from './AuditTrail.service';
import { AuditTrailRepository } from './AuditTrail.repository';

// Mock repository
const mockAuditTrailRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('AuditTrailService', () => {
  let service: AuditTrailService;
  let repository: typeof mockAuditTrailRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditTrailService,
        { provide: AuditTrailRepository, useValue: mockAuditTrailRepository },
      ],
    }).compile();

    service = module.get<AuditTrailService>(AuditTrailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
