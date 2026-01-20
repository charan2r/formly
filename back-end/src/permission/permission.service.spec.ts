import { Test, TestingModule } from '@nestjs/testing';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '../model/permission.entity';

describe('PermissionService', () => {
  let permissionService: PermissionService;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permission),
          useClass: PermissionRepository,
        },
      ],
    }).compile();

    permissionService = module.get<PermissionService>(PermissionService);
    permissionRepository = module.get<PermissionRepository>(getRepositoryToken(Permission));
  });

  it('should be defined', () => {
    expect(permissionService).toBeDefined();
  });
});
