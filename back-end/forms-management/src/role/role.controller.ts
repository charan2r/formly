import { Controller, UseGuards, Get, Delete, Param, Post, Body, Patch, UseGuards, Request, Req, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
      data: roles.map(role => ({
        roleId: role.roleId,
        role: role.role,
        description: role.description,
        organizationId: role.organizationId,
        createdAt: role.createdAt,
        status: role.status
      })),
    };
  }


  // Soft delete a role
  @Delete(':id')
  async deleteRole(
    @User('organizationId') organizationId: string,
    @Param('id') id: string
  ) {
    await this.roleService.deleteRoleForOrganization(id, organizationId);
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
  async deleteRoles(
    @User('organizationId') organizationId: string,
    @Body() ids: string[]
  ) {
    await this.roleService.deleteRolesForOrganization(ids, organizationId);
    return {
      status: 'success',
      message: 'Roles soft deleted successfully',
      data: { deletedIds: ids },
    };
  }

  @Patch(':id')
  async updateRole(
    @User('organizationId') organizationId: string,
    @Param('id') roleId: string,
    @Body() updateRoleDto: CreateRoleDto
  ) {
    const updatedRole = await this.roleService.updateRoleForOrganization(
      roleId,
      updateRoleDto,
      organizationId
    );
    return {
      status: 'success',
      message: 'Role updated successfully',
      data: updatedRole,
    };
  }

  @Get(':id')
  async getRole(
    @User('organizationId') organizationId: string,
    @Param('id') roleId: string
  ) {
    try {
      const role = await this.roleService.getRoleByIdAndOrganization(roleId, organizationId);
      
      if (!role) {
        throw new HttpException({
          status: 'error',
          message: 'Role not found',
        }, HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        message: 'Role retrieved successfully',
        data: {
          roleId: role.roleId,
          role: role.role,
          description: role.description,
          organizationId: role.organizationId,
          createdAt: role.createdAt,
          status: role.status
        },
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Failed to retrieve role',
      }, HttpStatus.BAD_REQUEST);
    }
  }
}