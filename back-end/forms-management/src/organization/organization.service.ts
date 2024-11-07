/* eslint-disable prettier/prettier */
// organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { UserRepository } from 'src/user/user.repository';
import { Organization } from '../model/organization.entity';
import { User } from '../model/user.entity';
import { UpdateOrganizationDto } from './organization.dto';
import { In } from 'typeorm';

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

  // Method to get a single organization by ID
  async getOne(id: string): Promise<Organization | null> {
      return this.organizationRepository.findOne({ where: { orgId: id } });
  }

  // Method to update an organization
  async updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization | null> {
      const organization = await this.organizationRepository.findOne({ where: { orgId: id } });
      if (!organization) {
          throw new NotFoundException(`Organization with ID "${id}" not found`);
      }

      Object.assign(organization, updateOrganizationDto);
      return this.organizationRepository.save(organization);
  }

  // Method to soft-delete an organization by setting status to 'deleted'
  async deleteOne(id: string): Promise<boolean> {
      const organization = await this.organizationRepository.findOne({ where: { orgId: id } });
      if (!organization) {
          return false;
      }

      organization.status = 'deleted';
      await this.organizationRepository.save(organization);
      return true;
  }

  // Method to bulk soft-delete organizations by setting their status to 'deleted'
  async bulkDelete(orgIds: string[]): Promise<Organization[]> {
      const organizations = await this.organizationRepository.find({
        where: { orgId: In(orgIds) },
      });
      if (organizations.length === 0) {
          throw new NotFoundException(`No organizations found for the provided IDs`);
      }

      organizations.forEach(org => org.status = 'deleted');
      return this.organizationRepository.save(organizations);
  }

  
}
