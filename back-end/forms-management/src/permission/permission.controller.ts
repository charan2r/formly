import { Controller, Get, Param,UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from '../model/permission.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // Get all permissions
  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }

  // Get one permission
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.getPermissionById(id);
  }
}
