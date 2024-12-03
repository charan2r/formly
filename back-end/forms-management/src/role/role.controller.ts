import { Controller, UseGuards, Get, Delete, Param, Post, Body, Patch, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service';
import { CreateRoleDto } from 'src/dto/create-role.dto';
import { User, JwtUser } from '../decorators/user.decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(
    @User() user: JwtUser,
    @Body() createRoleDto: CreateRoleDto
  ) {
    try {
      // if (!user.permissions?.includes('createUsers')) {
      //   throw new UnauthorizedException('You do not have permission to create roles');
      // }

      const roleWithOrg = {
        ...createRoleDto,
        organizationId: user.organizationId
      };
      
      const role = await this.roleService.create(roleWithOrg);
      
      return {
        status: 'success',
        message: 'Role created successfully',
        data: {
          roleId: role.roleId,
          role: role.role,
          description: role.description,
          organizationId: role.organizationId,
          createdAt: role.createdAt
        },
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: error.message || 'Failed to create role',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllRoles(@User('organizationId') organizationId: string) {
    const roles = await this.roleService.getAllByOrganization(organizationId);
    return {
      status: 'success',
      message: 'Roles retrieved successfully',
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
    return {
      status: 'success',
      message: 'Role deleted successfully',
      data: { roleId: id },
    };
  }

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