// organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { UserRepository } from 'src/user/user.repository';
import { Organization } from '../model/organization.entity';
import { User } from '../model/user.entity';
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
  ): Promise<Organization> {
    // Step 1: Create the Super Admin User
    const superAdmin = await this.userRepository.createUser({
      ...superAdminData,
      userType: 'SuperAdmin',
    });

    // Step 2: Create the Organization and link the Super Admin
    const organization = this.organizationRepository.create({
      ...organizationData,
      superAdminId: superAdmin.id, // Assign the SuperAdmin ID to the organization
    });
    await this.organizationRepository.save(organization);

    // Step 3: Assign the organization ID to the SuperAdmin
    superAdmin.organizationId = organization.orgId;
    await this.userRepository.save(superAdmin); // Save the updated SuperAdmin with organizationId

    // Return the created organization
    return organization;
  }

  // Method to get all organizations
  async getAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  // Method to delete an organization
  async deleteOne(id: string): Promise<DeleteResult> {
    return this.organizationRepository.delete(id);
  }
}
