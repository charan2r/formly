/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Controller, Get, Query, NotFoundException, Post, Body, Patch, Delete, UseGuards, ForbiddenException, Request, BadRequestException,ExecutionContext} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from 'src/model/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Permissions } from './decorators/permissions.decorator';


@Controller('users')
@UseGuards(AuthGuard('jwt'),RolesGuard) // Protect all routes with JWT authentication
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Endpoint to get all users without pagination
  @Get()
  @Roles("Admin","SubUser")
  @Permissions("View User", "Edit User", "Delete User", "Create User")
  async getUsers(
    @Request() req: any,
    @Query('organizationId') organizationId?: string
  ){
    const user = req.user;
    if (!organizationId) {
      organizationId = user.organizationId;
    }
    
    if (user.organizationId !== organizationId) {
      throw new ForbiddenException(
        `Admins can only view users from their own organization`
      );
    }
  
    const users = await this.userService.getUsers(organizationId);
    return { 
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  // API endpoint to get details of a specific user by ID
  @Get('details')
  @Roles("Admin","SubUser")
  @Permissions("View User", "Edit User", "Delete User", "Create User")
  async getUserById(@Query('userId') userId: string): Promise<{ message: string; status: string;data: User }> {
    if (!userId) {
      throw new NotFoundException('User ID query parameter is required');
    }
    
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return {
      status: 'success',
      message: 'User details retrieved successfully',
      data: user,
    }
  }

  // API endpoint to create a new user
  @Post('create')
  @Roles("Admin","SubUser")
  @Permissions('Create User')
  async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; status: string; data: User }> {
    const newUser: User = await this.userService.addUser(createUserDto);
    return {
      status: 'success',
      message: 'User created successfully',
      data: newUser,
    };
  }


  // API endpoint to update a user
  @Patch('edit')
  @Roles("Admin","SubUser")
  @Permissions("Edit User")
  async updateUser(
    @Query('userid') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; status: string; data: User }> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    return {
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  // API endpoint to delete a user
  @Delete('delete')
  @Roles("Admin","SubUser")
  @Permissions("Delete User")
  async deleteUser(
    @Body() body: { userId: string; organizationId: string }
  ): Promise<{ status: string; message: string }> {
    const { userId, organizationId } = body;
  
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    const result = await this.userService.deleteUser(userId);
  
    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return {
      status: 'success',
      message: 'Status of user changed successfully'
    };
  }
  

  // API endpoint to bulk delete users
  @Delete('bulk-delete')
  @Roles("Admin","SubUser")
  @Permissions("Delete User")
  async bulkDeleteUsers(
    @Body() body: { ids: string[] },
    @Request() request: any 
    ): Promise<{ status: string; message: string }> {
      const { ids } = body;
      if (!ids || ids.length === 0) {
        throw new BadRequestException('User IDs are required');
      }
      const user = request.user;
      await this.userService.bulkDeleteUsers(ids);
      return {
        status: 'success',
        message: 'Status of users changed successfully',
      };
    }
  }
