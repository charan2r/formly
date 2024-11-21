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

}
