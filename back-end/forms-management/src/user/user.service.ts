/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/model/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { In } from 'typeorm';
//import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/auth/email.service';
import { TokenService } from 'src/auth/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

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

  // Method to get a user by email
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Fetch user by verification token
  async getUserByVerificationToken(token: string): Promise<User | null> {
    console.log(token);
    return this.userRepository.findOne({ where: { verificationToken: token } });
  }
  

  // Method to add a new user
  async addUser(createUserDto: CreateUserDto): Promise<User> {

    const candidate = await this.getUserByEmail(createUserDto.email);
    if (candidate) {
      throw new NotFoundException('User with this email already exists');
    }
    console.log(createUserDto);

    const {verificationToken, verificationTokenExpires} = TokenService.generateVerificationToken();

    const newUser = this.userRepository.create({
      ...createUserDto,
      isVerified: false,
      passwordHash: '',
      verificationToken,
      verificationTokenExpires,
    });
    
    await this.emailService.sendVerificationEmail(createUserDto.email, verificationToken);
    return await this.userRepository.save(newUser);
    
  }

  // Method to update a user
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log(updateUserDto);

    // Update the existing user entity with new data
    Object.assign(existingUser, updateUserDto);

    // Save the updated entity back to the database
    await this.userRepository.save(existingUser);

    // Return the updated user
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
