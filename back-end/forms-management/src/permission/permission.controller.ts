import { Controller, Post, Body, Get, Param, Patch, Delete, BadRequestException} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from '../model/permission.entity';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  //create 
  @Post()
  async createPermission(@Body('name') name: string): Promise<Permission> {
    return this.permissionService.createPermission(name);
  }

  //get all
  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }
  //get one
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.getPermissionById(id);
  }

  // update/edit
  @Patch(':id')
  async updatePermission(
    @Param('id') permissionId: string,
    @Body('name') name: string,): Promise<Permission> {const permission = await this.permissionService.updatePermission(permissionId, name);
      return permission;
  }

  // Soft Delete
  @Delete(':id')
  async softDeletePermission(@Param('id') permissionId: string): Promise<{ status: string, message: string }> {
    await this.permissionService.softDeletePermission(permissionId);
    return {
      status: 'success',
      message: `Permission with ID ${permissionId} successfully soft-deleted.`,
    };
  }


  // Soft Bulk Delete
  @Delete()
  async bulkSoftDeletePermissions(@Body() permissionIds: { permissionIds: string[] }): Promise<{ status: string, message: string }> {
    const deletedPermissions = await this.permissionService.bulkSoftDeletePermissions(permissionIds.permissionIds);
    return {
      status: 'success',
      message: `${deletedPermissions.length} permissions successfully soft-deleted.`,
    };
  }

}
