/* eslint-disable prettier/prettier */
import { Controller, Get, Query, NotFoundException, Post, Body, Patch, Delete, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { User } from 'src/model/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Protect all routes with JWT authentication
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

  // API endpoint to create a new user
  @Post('create')
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
  async updateUser(
    @Query('id') id: string,
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
  async deleteUser(@Query('id') id: string): Promise<{ status: string; message: string }> {
    const result = await this.userService.deleteUser(id);
    if (!result) {
      throw new NotFoundException(`User not found`);
    }
    return {
      status: 'success',
      message: `Status of user changed succeessfully`,
    };
  }

  // API endpoint to bulk delete users
  @Delete('bulk-delete')
  async bulkDeleteUsers(@Body('ids') ids: string[]): Promise<{ status: string; message: string }> {
    await this.userService.bulkDeleteUsers(ids);
    return {
      status: 'success',
      message: 'Ststus of users changed successfully',
    };
  }

}
