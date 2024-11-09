// organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../model/user.entity';
import { Organization } from 'src/model/organization.entity';
import { UserRepository } from 'src/user/user.repository';
import { OrganizationRepository } from './organization.repository';
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
  ) {
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
    return organization;
  }

  // Method to get all organizations
  async getAll() {
    // return this.organizationRepository.find();
    return await this.organizationRepository.find();
  }

  // Method to get a single organization with its super admin details
  async getOne(
    id: string,
  ): Promise<{ organization: Organization; superAdmin: User | null }> {
    // Find the organization by its ID
    const organization = await this.organizationRepository.findOne({
      where: { orgId: id },
    });

    if (!organization) {
      return null;
    }

    // Fetch the super admin details using the superAdminId
    const superAdmin = await this.userRepository.findOne({
      where: { id: organization.superAdminId, userType: 'SuperAdmin' },
    });

    return { organization, superAdmin };
  }

  // Method to update an organization
  async updateOrganization(
    id: string,
    updateData: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { orgId: id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Update organization details
    Object.assign(organization, updateData);
    return this.organizationRepository.save(organization);
  }

  // Method to soft-delete an organization by setting status to 'deleted'
  async deleteOne(id: string): Promise<boolean> {
    const organization = await this.organizationRepository.findOne({
      where: { orgId: id },
    });
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
      throw new NotFoundException(
        `No organizations found for the provided IDs`,
      );
    }

    organizations.forEach((org) => (org.status = 'deleted'));
    return this.organizationRepository.save(organizations);
  }
}
