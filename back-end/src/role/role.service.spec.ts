import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: RoleRepository;
  let organizationRepository: OrganizationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: {}, // Mock implementation can go here if needed later
        },
        {
          provide: OrganizationRepository,
          useValue: {}, // Mock implementation can go here if needed later
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    organizationRepository = module.get<OrganizationRepository>(OrganizationRepository);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });
});
