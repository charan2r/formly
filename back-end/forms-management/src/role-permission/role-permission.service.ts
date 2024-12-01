import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
// update 
  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw new BadRequestException('permissionIds must be a non-empty array');
    }
  
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { role: { roleId }, permission: { permissionId: In(permissionIds) } },
      relations: ['role', 'permission'],
    });
  
    for (const permissionId of permissionIds) {
      const existingPermission = rolePermissions.find(
        (rolePermission) => rolePermission.permission?.permissionId === permissionId
      );
  
      if (existingPermission) {
        if (existingPermission.status === 'deleted') {
          existingPermission.status = 'active';
          await this.rolePermissionRepository.save(existingPermission);
        }
      } else {
        const newRolePermission = this.rolePermissionRepository.create({
          role: { roleId },
          permission: { permissionId },
          status: 'active',
        });
        await this.rolePermissionRepository.save(newRolePermission);
      }
    }
  }

    // Delete a specific role-permission
async softDeleteRolePermission(roleId: string, permissionId: string): Promise<void> {
  const rolePermission = await this.rolePermissionRepository.findOne({
    where: { role: { roleId }, permission: { permissionId }, status: 'active' }, // Only active records
  });

  if (!rolePermission) {
    throw new NotFoundException(
      `Active role-permission with roleId: ${roleId} and permissionId: ${permissionId} not found or already deleted`,
    );
  }

  rolePermission.status = 'deleted';
  await this.rolePermissionRepository.save(rolePermission);
}

// Bulk delete permissions
async softBulkDeleteRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
  if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
    throw new BadRequestException('permissionIds must be a non-empty array');
  }

  const permissions = await this.permissionRepository.find({
    where: { permissionId: In(permissionIds) },
  });

  if (permissions.length !== permissionIds.length) {
    throw new NotFoundException('One or more permissions not found');
  }

  const rolePermissions = await this.rolePermissionRepository.find({
    where: {
      role: { roleId },
      permission: { permissionId: In(permissionIds) },
      status: 'active',
    },
  });

  if (rolePermissions.length === 0) {
    throw new NotFoundException(
      'No active role-permissions found for the given role and permissions',
    );
  }

  rolePermissions.forEach((rolePermission) => {
    rolePermission.status = 'deleted';
  });

  await this.rolePermissionRepository.save(rolePermissions);
}

}
