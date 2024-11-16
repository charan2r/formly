/* eslint-disable prettier/prettier */
import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/model/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Endpoint to get all users without pagination
  @Get()
  async getUsers(
    @Query('organizationId') organizationId?: string,
  ){
    const users = await this.userService.getUsers(organizationId);
    return { 
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  // API endpoint to get details of a specific user by ID
  @Get('details')
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
}
