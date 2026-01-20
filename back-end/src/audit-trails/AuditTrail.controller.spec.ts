import { Test, TestingModule } from '@nestjs/testing';
import { AuditTrailController } from './AuditTrail.controller';
import { AuditTrailService } from './AuditTrail.service';
import { AuditTrail } from '../model/Audittrail.entity';

// Mock service for testing purposes
class MockAuditTrailService {
  getAll(): Promise<AuditTrail[]> {
    return Promise.resolve([]);
  }

  getById(id: string): Promise<AuditTrail> {
    return Promise.resolve(new AuditTrail());
  }
}

describe('AuditTrailController', () => {
  let controller: AuditTrailController;
  let service: AuditTrailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditTrailController],
      providers: [
        {
          provide: AuditTrailService,
          useClass: MockAuditTrailService,
        },
      ],
    }).compile();

    controller = module.get<AuditTrailController>(AuditTrailController);
    service = module.get<AuditTrailService>(AuditTrailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
