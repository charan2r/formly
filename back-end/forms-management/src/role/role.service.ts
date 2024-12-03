import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { In } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from 'src/dto/updateRole.dto';

@Injectable()
export class RoleService {                
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  // create a role
  async create(createRoleDto: CreateRoleDto) {
    const { role, description, organizationId} = createRoleDto;

    const organization = await this.organizationRepository.findOne({
      where: { orgId: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const newRole = this.roleRepository.create({
      role,
      description,
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

    //Soft bulk delete
    async deleteRoles(roleIds: string[], organizationId: string): Promise<boolean> {
      const roles = await this.roleRepository.find({
        where: { roleId: In(roleIds), organization: { orgId: organizationId }, status: 'active' },
      });
    
      if (roles.length === 0) {
        throw new NotFoundException('roles not found for the provided IDs in your organization');
      }
    
      roles.forEach((role) => {
        role.status = 'deleted';
      });
      await this.roleRepository.save(roles);
    
      return true;
    }
    
  // Update
  async updateRole(roleId: string, updateRoleDto: UpdateRoleDto, organizationId: string) {
    const { role, description } = updateRoleDto;
    
    // Check if the role belongs to the admin's organization
    const existingRole = await this.roleRepository.findOne({
      where: { roleId, organization: { orgId: organizationId } },
    });
    
    if (!existingRole) {
      throw new NotFoundException('Role not found in your organization');
    }
    
    existingRole.role = role || existingRole.role;
    existingRole.description = description || existingRole.description;
    
    const updatedRole = await this.roleRepository.save(existingRole);
    return updatedRole;
  }


}
