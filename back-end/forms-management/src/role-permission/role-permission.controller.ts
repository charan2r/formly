import { Controller, Body, Param, Post, Get, Delete, Patch, BadRequestException, UseGuards } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { PermissionRepository } from '../permission/permission.repository';
import { Roles } from 'src/user/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';


@UseGuards(AuthGuard('jwt'))
@Controller('role-permissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post(':roleId')
  @Roles('Admin')
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      throw new BadRequestException('permissionIds must be a non-empty array');
    }

    await this.rolePermissionService.assignPermissionsToRole(
      roleId,
      permissionIds,
    );

    return {
      status: 'success',
      message: 'Permissions assigned to role successfully',
      data: {
        roleId,
        permissionIds
      }
    };
  }

  // Get a role with its permissions
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
