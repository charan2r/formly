// organization.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '../model/user.entity';
import { Organization } from 'src/model/organization.entity';
import { UserRepository } from 'src/user/user.repository';
import { OrganizationRepository } from './organization.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    private organizationRepository: OrganizationRepository,
    private userRepository: UserRepository, // Inject the UserRepository
  ) {}

  // Method to create an organization and its super admin
  async createOrganizationWithSuperAdmin(
    organizationData: Partial<Organization>,
    superAdminData: Partial<User>,
  ) {
    try {
      // Step 1: Create the Super Admin User
      const superAdmin = await this.userRepository.createUser({
        ...superAdminData,
        userType: 'SuperAdmin',
      });

      // Step 2: Create the Organization and link the Super Admin
      const organization = this.organizationRepository.create({
        ...organizationData,
        superAdminId: superAdmin.id,
      });
      await this.organizationRepository.save(organization);

      // Step 3: Assign the organization ID to the SuperAdmin
      superAdmin.organizationId = organization.orgId;
      await this.userRepository.save(superAdmin);

      // Return the structured response
      return {
        status: 'success',
        data: organization,
        message: 'Organization created successfully',
        metadata: null,
      };
    } catch (error) {
      // Handle any error and return an appropriate response
      return {
        status: 'error',
        data: null,
        message: 'Failed to create organization',
        metadata: error.message,
      };
    }
  }

  // Method to get all organizations
  async getAll() {
    // return this.organizationRepository.find();
    const organizations = await this.organizationRepository.find();
    try {
      return {
        status: 'success',
        data: organizations,
        message: 'Organizationsretriecved successfully ',
        metadata: null,
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Failed to create organization',
        metadata: error.message,
      };
    }
  }

  // Method to delete an organization
  async deleteOne(id: string) {
    try {
      return {
        status: 'success',
        data: await this.organizationRepository.delete(id),
        message: 'Organization created successfully',
        metadata: null,
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        message: 'Failed to create organization',
        metadata: error.message,
      };
    }
  }
}
