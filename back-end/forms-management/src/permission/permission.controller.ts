import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from '../model/permission.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/roles.guard';
import { Permissions } from '../user/decorators/permissions.decorator';
import { Roles } from 'src/user/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @Roles('Admin', 'SubUser')
  @Permissions('View Permissions')
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }

  @Get(':id')
  @Roles('Admin', 'SubUser')
  @Permissions('View Permissions')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.permissionService.getPermissionById(id);
  }
}
