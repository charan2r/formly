import { Controller, Get} from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRoles() {
    const roles = await this.roleService.getAll();
    return {
      status: 'success',
      message: 'Roles retrieved successfully',
      data: roles,
      
    };
  }
};