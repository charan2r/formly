import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionRepository } from './role-permission.repository';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from 'src/permission/permission.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RolePermissionService', () => {
  let rolePermissionService: RolePermissionService;
  let rolePermissionRepository: RolePermissionRepository;
  let roleRepository: RoleRepository;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolePermissionService,
        {
          provide: getRepositoryToken(RolePermissionRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(RoleRepository),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PermissionRepository),
          useValue: {},
        },
      ],
    }).compile();

    rolePermissionService = module.get<RolePermissionService>(RolePermissionService);
    rolePermissionRepository = module.get<RolePermissionRepository>(getRepositoryToken(RolePermissionRepository));
    roleRepository = module.get<RoleRepository>(getRepositoryToken(RoleRepository));
    permissionRepository = module.get<PermissionRepository>(getRepositoryToken(PermissionRepository));
  });

  it('should be defined', () => {
    expect(rolePermissionService).toBeDefined();
  });
});
