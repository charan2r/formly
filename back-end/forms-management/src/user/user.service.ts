/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/model/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Method to get users for grid view with pagination and organization filter
  async getUsers(organizationId?: string, page: number = 1, limit: number = 10): Promise<[User[], number]> {
    const [users, total] = await this.userRepository.findAndCount({
      where: organizationId ? { organizationId } : {},
      take: limit,
      skip: (page - 1) * limit,
    });
    return [users, total];
  }

  // Method to get a user by ID
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  
}
