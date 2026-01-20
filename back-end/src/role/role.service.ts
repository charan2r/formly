import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { In } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/model/role.entity';
@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,

  ) {}

  // create a role
  async create(createRoleDto: CreateRoleDto) {
    const { role, description, organizationId } = createRoleDto;

    const organization = await this.organizationRepository.findOne({
      where: { orgId: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const newRole = this.roleRepository.create({
      role,
      description,
      organizationId,
      organization,
      status: 'active',
    });

    const savedRole = await this.roleRepository.save(newRole);
    return savedRole;
  }

  // Get all roles
  async getAllByOrganization(organizationId: string) {
    const organization = await this.organizationRepository.findOne({
      where: { orgId: organizationId },
    });
  
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
  
    return await this.roleRepository.find({
      where: { organization: { orgId: organizationId } },
    });
  }
  
  

  // Get a single role
  async getOne(roleId: string, organizationId: string) {
    const role = await this.roleRepository.findOne({
      where: { roleId, organization: { orgId: organizationId } },
    });
  
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  
    return role;
  }  
  
    //Soft delete a role
    async deleteRole(roleId: string, organizationId: string): Promise<boolean> {
      const role = await this.roleRepository.findOne({
        where: { roleId, organization: { orgId: organizationId }, status: 'active' },
      });
    
      if (!role) {
        throw new NotFoundException('Role not found or already being deleted');
      }
    
      role.status = 'deleted';
      await this.roleRepository.save(role);
      return true;
    }    

  // Delete role for organization
  async deleteRoleForOrganization(roleId: string, organizationId: string) {
    const role = await this.roleRepository.findOne({
      where: {
        roleId,
        organizationId,
        status: 'active',
      }
    });

    if (!role) {
      throw new NotFoundException('Role not found or unauthorized');
    }

    role.status = 'deleted';
    return this.roleRepository.save(role);
  }

  // Bulk delete roles for organization
  async deleteRolesForOrganization(roleIds: string[], organizationId: string) {
    const roles = await this.roleRepository.find({
      where: {
        roleId: In(roleIds),
        organizationId,
        status: 'active',
      }
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Some roles not found or unauthorized');
    }

    // Update status to deleted for all roles
    roles.forEach((role) => {
      role.status = 'deleted';
    });

    return this.roleRepository.save(roles);
  }

  // Update role
  async updateRoleForOrganization(
    roleId: string,
    updateDto: CreateRoleDto,
    organizationId: string
  ) {
    const role = await this.roleRepository.findOne({
      where: {
        roleId,
        organizationId,
        status: 'active'
      }
    });

    if (!role) {
      throw new NotFoundException('Role not found or unauthorized');
    }
  
    // Update the role
    role.role = updateDto.role || role.role;
    role.description = updateDto.description || role.description;

    return this.roleRepository.save(role);  
  }
  

}
