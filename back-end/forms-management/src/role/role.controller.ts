import { Controller, Get, Delete, Param, Post, Body, Patch} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from '../dto/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);  
    const { organization, ...roleData } = role;

    return {
      status: 'success',
      message: 'Role created successfully',
      data: {
        ...roleData,
        organizationId: role.organization?.orgId,
      },
    };
  }


  @Get()
  async getAllRoles() {
    const roles = await this.roleService.getAll();
    return {
      status: 'success',
      message: 'Roles retrieved successfully',
      data: roles,
      
    };
  }

  //get one role by id
  @Get(':id')
  async getRole(@Param('id') roleId: string) {
    const role = await this.roleService.getOne(roleId);
    return {
      status: 'success',
      message: 'Role retrieved successfully',
      data: role,
    };
  }

  // Soft delete a role
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    await this.roleService.deleteRole(id);
    return {
      status: 'success',
      message: 'Role deleted successfully',
      data: { roleId: id },
    };
  }

  //soft bulk delete
  @Delete()
  async deleteRoles(@Body() ids: string[]) {
    await this.roleService.deleteRoles(ids);
    return {
      status: 'success',
      message: 'Roles soft deleted successfully',
      data: { deletedIds: ids },
    };
  }

    // Update Role (PATCH)
    @Patch(':id')
    async updateRole(@Param('id') roleId: string, @Body() updateRoleDto: CreateRoleDto) {
      const updatedRole = await this.roleService.updateRole(roleId, updateRoleDto);
      return {
        status: 'success',
        message: 'Role updated successfully',
        data: updatedRole,
      };
    }
};