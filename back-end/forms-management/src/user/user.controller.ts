/* eslint-disable prettier/prettier */
import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/model/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API Endpoint to get all users 
  @Get()
  async getUsers(
    @Query('organizationId') organizationId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: User[]; total: number; page: number; limit: number; message: string; status: string }> {
    const [users, total] = await this.userService.getUsers(organizationId, page, limit);
    return { 
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
      total,
      page,
      limit,
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
