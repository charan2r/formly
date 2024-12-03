/* eslint-disable prettier/prettier */
// organization.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../model/user.entity';
import { Organization } from 'src/model/organization.entity';
import { UserRepository } from 'src/user/user.repository';
import { OrganizationRepository } from './organization.repository';
import { UpdateOrganizationDto } from './organization.dto';
import { In } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OrganizationService {
  constructor(
    private organizationRepository: OrganizationRepository,
    private userRepository: UserRepository, // Inject the UserRepository
    private authService: AuthService, // Inject the AuthService
  ) {}

  // Create an organization and register its admin
  async createOrganizationWithSuperAdmin(
    organizationData: Partial<Organization>,
    superAdminData: Partial<User>,
  ): Promise<Organization> {
    // Step 1: Create the Organization
    const organization = this.organizationRepository.create({
      ...organizationData,
    });
    await this.organizationRepository.save(organization);

    // Step 2: Register Admin via AuthService
    const adminData = {
      ...superAdminData,
      organizationId: organization.orgId, // Link admin to organization
    };
    const admin = await this.authService.registerAdmin(adminData);
    organization.superAdminId = admin.data.id; // Link organization to admin
    await this.organizationRepository.save(organization);

    return organization;
  }

  // Method to get all organizations
  async getAll() {
    return await this.organizationRepository.find();
  }

  // Method to get a single organization with its super admin details
  async getOne(
    id: string,
  ): Promise<{ organization: Organization; superAdmin: User | null }> {
    const organization = await this.organizationRepository.findOne({
      where: { orgId: id },
    });

    if (!organization) {
      return null;
    }

    // Fetch the super admin details using the superAdminId
    const superAdmin = await this.userRepository.findOne({
      where: { id: organization.superAdminId },
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'], // ^ _ ^
    });

    console.log('Found superAdmin:', superAdmin); // Debug log

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

  // Method to find super admin by email
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async changeOrganizationAdmin(
    orgId: string,
    adminData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }
  ): Promise<{ organization: Organization; newAdmin: User }> {
    const organization = await this.organizationRepository.findOne({
      where: { orgId }
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check if email already exists
    const existingUser = await this.findUserByEmail(adminData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new admin
    const newAdminData = {
      ...adminData,
      userType: 'SuperAdmin',
      organizationId: orgId,
      password: "",
      verified: false,
    };

    const newAdmin = await this.authService.registerAdmin(newAdminData);
    
    // Update organization with new admin
    organization.superAdminId = newAdmin.data.id;
    await this.organizationRepository.save(organization);

    return { organization, newAdmin: newAdmin.data };
  }

  async getUserTypesCounts(user: { userType: string; organizationId?: string }): Promise<{ [key: string]: number }> {
    const whereCondition: any = { isDeleted: false };
  
    // If the user is an Admin, filter by their organizationId
    if (user.userType === 'Admin') {
      whereCondition.organizationId = user.organizationId;
    }
  
    const users = await this.userRepository.find({ where: whereCondition });
  
    const counts = users.reduce((acc, user) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    }, {});
  
    return counts;
  }
  
}
