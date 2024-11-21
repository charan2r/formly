import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { PermissionRepository } from '../permission/permission.repository';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RolePermissionController', () => {
  let rolePermissionController: RolePermissionController;
  let rolePermissionService: RolePermissionService;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionController],
      providers: [
        RolePermissionService,
        {
          provide: getRepositoryToken(PermissionRepository),
          useValue: {},
        },
      ],
    }).compile();

    rolePermissionController = module.get<RolePermissionController>(RolePermissionController);
    rolePermissionService = module.get<RolePermissionService>(RolePermissionService);
    permissionRepository = module.get<PermissionRepository>(getRepositoryToken(PermissionRepository));
  });

  it('should be defined', () => {
    expect(rolePermissionController).toBeDefined();
  });
});
