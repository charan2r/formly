import { Injectable, NotFoundException } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';
import { RolePermission } from '../model/role-permission.entity';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from 'src/permission/permission.repository';
import { In } from 'typeorm';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RolePermission[]> {
    const role = await this.roleRepository.findOneOrFail({ where: { roleId } });
  
    const permissions = await this.permissionRepository.find({
      where: { permissionId: In(permissionIds) },
    });
    
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }
  
    await this.rolePermissionRepository.delete({ role });
  
    const rolePermissions = permissions.map(permission => {
      return this.rolePermissionRepository.create({
        role,
        permission,
      });
    });
  
    return this.rolePermissionRepository.save(rolePermissions);
  }

  // Get all role-permission
  async getAllRolePermissions(): Promise<
  {
    roleId: string;
    role: string;
    description: string;
    status: string;
    permissions: { permissionId: string; name: string; status: string; createdAt: Date }[];
  }[]
  > {
    const rolePermissions = await this.rolePermissionRepository.find({
      relations: ['role', 'permission'],
    });
    const grouped = new Map<
    string,
    {
      roleId: string;
      role: string;
      description: string;
      status: string;
      permissions: { permissionId: string; name: string; status: string; createdAt: Date }[];
    }
  >();
  rolePermissions.forEach(({ role, permission, status }) => {
    if (!grouped.has(role.roleId)) {
      grouped.set(role.roleId, {
        roleId: role.roleId,
        role: role.role,
        description: role.description,
        status: role.status,
        permissions: [],
      });
    }
    grouped.get(role.roleId)?.permissions.push({
      permissionId: permission.permissionId,
      name: permission.name,
      status,
      createdAt: permission.createdAt,
    });
  });
  return Array.from(grouped.values());
  }



  // Get a specific role with its permissions
  async getOne(
    roleId: string,
  ): Promise<{
    roleId: string;
    role: string;
    description: string;
    status: string;
    permissions: { permissionId: string; name: string; status: string }[];
    }> {
      const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { roleId } },
      relations: ['role', 'permission'],
    });

    if (!rolePermissions.length) {
      throw new NotFoundException('Role not found or no permissions assigned');
    }
    
    const role = rolePermissions[0].role;
    return {
      roleId: role.roleId,
      role: role.role,
      description: role.description,
      status: role.status,
      permissions: rolePermissions.map(({ permission, status }) => ({
        permissionId: permission.permissionId,
        name: permission.name,
        status,
      })),
    };
  }


}
