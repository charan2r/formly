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
  ): Promise<{ data: User[]; total: number }> {
    const [users, total] = await this.userService.getUsers(organizationId);
    return {
      data: users,
      total,
    };
  }

  // API endpoint to get details of a specific user by ID
  @Get('details')
  async getUserById(@Query('userId') userId: string): Promise<User> {
    if (!userId) {
      throw new NotFoundException('User ID query parameter is required');
    }
    
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}
