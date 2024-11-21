import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';

@Injectable()
export class RoleService {                
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,  
  ) {}


  // Get all roles
  async getAll() {
    const role = await this.roleRepository.find({
    });

    return {
      ...role,
    };
  }// excluding/including deleted ones - {where: { status: 'deleted' },}, {where: { status: 'active' },}      

}
