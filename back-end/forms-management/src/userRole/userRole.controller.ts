import { Controller, Post, Param, Body, UseGuards, Request, Get, Patch, Delete, Query } from '@nestjs/common';
import { UserRoleService } from './userRole.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';
import { Roles } from 'src/user/roles.decorator';
import { UserRole } from 'src/model/UserRole.entity';

@Controller('user-roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}
  // Assign a role to a user
  @Post('assign')
  @Roles('Admin')
  async assignRoleToUser(@Body() body: { userId: string, roleId: string })
  {
    const { userId, roleId } = body
    await this.userRoleService.assignRoleToUser(userId, roleId);
    return {
        status: 'success',
        message: 'Role assigned to the user successfully',
        data : body,
    };
    }

    // Get all user roles
   @Get()
   @Roles('Admin')
   async getAllUserRoles(@Request() req) {
     const adminOrganizationId = req.user.organizationId;
     const userRoles = await this.userRoleService.getAllUserRoles(adminOrganizationId);
   
     return {
       status: 'success',
       message: 'User roles fetched successfully',
       data: userRoles,
     };
   }
   

  // Get a specific user role
  @Get(':id')
  @Roles('Admin')
  async getUserRole(@Param('id') id: string) {
    const userRole = await this.userRoleService.getUserRole(id);
    return {
      status: 'success',
      message: 'User role fetched successfully',
      data: userRole,
    };
  }

  // Update a user role
  @Patch(':id')
  @Roles('Admin')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateData: Partial<{ userId: string; roleId: string }>,
  ) {
    const updatedUserRole = await this.userRoleService.updateUserRole(
      id,
      updateData,
    );
    return {
      status: 'success',
      message: 'User role updated successfully',
      data: updatedUserRole,
    };
  }

  // Soft delete a specific user role
  @Delete(':id')
  @Roles('Admin')
  async deleteUserRole(@Param('id') id: string) {
    await this.userRoleService.deleteUserRole(id);
    return {
      status: 'success',
      message: 'User role soft-deleted successfully',
    };
  }

  // Bulk soft delete user roles
  @Delete()
  @Roles('Admin')
  async bulkDeleteUserRoles(@Query('ids') ids: string[]) {
    await this.userRoleService.bulkDeleteUserRoles(ids);
    return {
      status: 'success',
      message: 'User roles soft-deleted successfully',
    };
  }
}
