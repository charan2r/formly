import { Controller, Body, Param, Post, Get, Delete, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('role-permissions')
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post(':roleId')
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw new BadRequestException('permissionIds must be a non-empty array');
    }

    const rolePermissions = await this.rolePermissionService.assignPermissionsToRole(roleId, permissionIds);
    
    return {
      status: 'success',
      message: 'Permissions assigned successfully',
      data: rolePermissions
    };
  }  

  @Get(':roleId')
  async getRolePermissions(@Param('roleId') roleId: string) {
    const rolePermissions = await this.rolePermissionService.getRolePermissions(roleId);
    return {
      status: 'success',
      data: rolePermissions
    };
  }

  @Patch(':roleId')
  async updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw new BadRequestException('permissionIds must be a non-empty array');
    }

    console.log(roleId, permissionIds);

    await this.rolePermissionService.updateRolePermissions(roleId, permissionIds);
    return {
      status: 'success',
      message: 'Role permissions updated successfully',
      data: { roleId, permissionIds },
    };
  }

  @Delete(':roleId/:permissionId')
  async softDeleteRolePermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.rolePermissionService.softDeleteRolePermission(roleId, permissionId);
    return {
      status: 'success',
      message: 'Role permission soft deleted successfully',
    };
  }
}
