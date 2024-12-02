import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../model/role-permission.entity';
import { Role } from '../model/role.entity';
import { Permission } from '../model/permission.entity';
import { In } from 'typeorm';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RolePermission[]> {
    // Verify role exists
    const role = await this.roleRepository.findOne({ 
      where: { roleId, status: 'active' } 
    });
    if (!role) {
      throw new NotFoundException('Role not found or inactive');
    }

    // Verify permissions exist
    const permissions = await this.permissionRepository.find({
      where: { permissionId: In(permissionIds), status: 'active' }
    });
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found or inactive');
    }

    // Create new role-permission entries
    const rolePermissions = permissionIds.map(permissionId => {
      return this.rolePermissionRepository.create({
        roleId,
        permissionId,
        status: 'active'
      });
    });

    return this.rolePermissionRepository.save(rolePermissions);
  }

  async getRolePermissions(roleId: string) {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId, status: 'active' },
      relations: ['permission']
    });

    if (!rolePermissions.length) {
      throw new NotFoundException('No active permissions found for this role');
    }

    return rolePermissions;
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Verify role exists
    console.log(roleId);
    const role = await this.roleRepository.findOne({ 
      where: { roleId, status: 'active' } 
    });
    if (!role) {
      throw new NotFoundException('Role not found or inactive');
    }

    // Get existing role permissions
    const existingPermissions = await this.rolePermissionRepository.find({
      where: { roleId }
    });

    // Deactivate permissions not in the new list
    for (const existing of existingPermissions) {
      if (!permissionIds.includes(existing.permissionId)) {
        existing.status = 'deleted';
        await this.rolePermissionRepository.save(existing);
      }
    }

    // Add or reactivate new permissions
    for (const permissionId of permissionIds) {
      const existingPermission = existingPermissions.find(
        rp => rp.permissionId === permissionId
      );

      if (existingPermission) {
        if (existingPermission.status === 'deleted') {
          existingPermission.status = 'active';
          await this.rolePermissionRepository.save(existingPermission);
        }
      } else {
        const newRolePermission = this.rolePermissionRepository.create({
          roleId: roleId,
          permissionId: permissionId,
          status: 'active'
        });
        await this.rolePermissionRepository.save(newRolePermission);
      }
    }
  }

  async softDeleteRolePermission(roleId: string, permissionId: string): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { 
        roleId,
        permissionId,
        status: 'active'
      }
    });

    if (!rolePermission) {
      throw new NotFoundException('Role permission not found or already deleted');
    }

    rolePermission.status = 'deleted';
    await this.rolePermissionRepository.save(rolePermission);
  }
}
