/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/model/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { In } from 'typeorm';

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

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  

  // Method to add a new user
  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  // Method to delete a user
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id, isDeleted: false });
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    await this.userRepository.update(id, { isDeleted: true });
    return true;
  }

  // Method to bulk delete users
  async bulkDeleteUsers(ids: string[]): Promise<void> {
    const users = await this.userRepository.find({ where: { id: In(ids), isDeleted: false } });
    if (users.length !== ids.length) {
      throw new NotFoundException('Some user IDs are not found');
    }

    await this.userRepository.update(ids, { isDeleted: true });
  }
  
}
