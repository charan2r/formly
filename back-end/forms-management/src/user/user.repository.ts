/* eslint-disable prettier/prettier */
// user.repository.ts
import { Injectable } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
      }
    
    // Method to find all users by organization, with optional filter if organizationId is provided
    async findByOrganization(organizationId?: string): Promise<User[]> {
        if (organizationId) {
            return this.find({ where: { organizationId } });
        }
        return this.find();
    }

    // Method to create a user with optional organization association
    async createUser(userData: Partial<User>): Promise<User> {
        const user = this.create(userData);
        return this.save(user);
    }

}
