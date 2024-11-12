/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/model/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

// Method to get users for grid view without pagination
async getUsers(organizationId?: string): Promise<[User[], number]> {
  const [users, total] = await this.userRepository.findAndCount({
    where: organizationId ? { organizationId } : {},
  });
  return [users, total];
}

  // Method to get a user by ID
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  
}
