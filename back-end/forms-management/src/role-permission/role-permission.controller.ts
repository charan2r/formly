import { Controller, Body, Param, Post, Get, Delete, Patch, BadRequestException } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { PermissionRepository } from '../permission/permission.repository';

@Controller('role-permissions')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    private readonly permissionRepository: PermissionRepository,
  ) {}


  @Post(':roleId')
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body('permissions') permissionIds: string[],
  ) {
    const rolePermissions = await this.rolePermissionService.assignPermissionsToRole(roleId, permissionIds);
  
    const role = rolePermissions[0]?.role;
    const permissions = rolePermissions.map(rp => rp.permission);
  
    return {
      role,
      permissions,
    };
  }  

  // Get all role-permission
  @Get()
  async getAllRolePermissions() {
    const rolePermissions = await this.rolePermissionService.getAllRolePermissions();
    return rolePermissions;
  }

  // Get a role with its permissions
  @Get(':roleId')
  async getOne(@Param('roleId') roleId: string) {
    return await this.rolePermissionService.getOne(roleId);
  }


   // edit permissions or reactivate previously deleted permissions
   @Patch(':roleId')
async updateRolePermissions(
  @Param('roleId') roleId: string,
  @Body('permissionIds') permissionIds: string[],
) {
  if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
    throw new BadRequestException('permissionIds must be a non-empty array');
  }

  await this.rolePermissionService.updateRolePermissions(roleId, permissionIds);
  return {
    status: 'success',
    message: 'Role permissions updated successfully',
    data: { roleId, permissionIds },
  };
}

 

  
}
