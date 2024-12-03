import { Controller, Get, Delete, Param, Post, Body, Patch, UseGuards, Request, Req} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';
import { Roles } from 'src/user/roles.decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Roles('Admin')
  async createRole(@Body() createRoleDto: CreateRoleDto, @Request() req: any) {

    if (!createRoleDto.organizationId) {
      createRoleDto.organizationId = req.user.organizationId;
    }
    
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

  // get all roles 
  @Get()
  @Roles('Admin')
  async getAllRoles(@Req() request) {
    const organizationId = request.user.organizationId;
    const roles = await this.roleService.getAllByOrganization(organizationId);
    return {
      status: 'success',
      message: 'Roles retrieved successfully',
      data: roles,
    };
  }
  
  //get one role by id
  @Get(':id')
  @Roles('Admin')
  async getRole(@Req() request, @Param('id') roleId: string) {
    const organizationId = request.user.organizationId;
    const role = await this.roleService.getOne(roleId, organizationId);
    return {
      status: 'success',
      message: 'Role retrieved successfully',
      data: role,
    };
  }


  // Soft delete a role
  @Delete(':id')
  @Roles('Admin')
  async deleteRole(@Req() request, @Param('id') id: string) {
    const organizationId = request.user.organizationId;
    await this.roleService.deleteRole(id, organizationId);
    
    return {
      status: 'success',
      message: 'Role deleted successfully',
      data: { roleId: id },
    };
  }


  //soft bulk delete
  @Delete()
  @Roles('Admin')
  async deleteRoles(@Req() request, @Body() ids: string[]) {
    const organizationId = request.user.organizationId;
    await this.roleService.deleteRoles(ids, organizationId);
    return {
      status: 'success',
      message: 'Roles soft deleted successfully',
      data: { deletedIds: ids },
    };
  }
  
  // Update Role (PATCH)
  @Patch(':id')
  @Roles('Admin')
  async updateRole(@Param('id') roleId: string, @Body() updateRoleDto: CreateRoleDto, @Req() request) {
    const organizationId = request.user.organizationId;
    const updatedRole = await this.roleService.updateRole(roleId, updateRoleDto, organizationId);
    return {
      status: 'success',
      message: 'Role updated successfully',
      data: updatedRole,
    };
  }
};