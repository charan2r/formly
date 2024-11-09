/* eslint-disable prettier/prettier */
import { Controller, Get, Delete, Post, NotFoundException, Query, Patch, Body, BadRequestException, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from 'src/model/organization.entity';
import { UpdateOrganizationDto } from './organization.dto';
import { CreateOrganizationWithSuperAdminDto } from 'src/dto/create-organization.dto';
import { User } from 'src/model/user.entity';


@Controller('organization')
export class OrganizationController {

    constructor(private readonly organizationService: OrganizationService) {}

    // API endpoint to get all organizations
    @Get()
    async getAll() {
        const organizations = await this.organizationService.getAll();
        return {
            status: 'success',
            message: 'Organizations retrieved successfully',
            data: organizations,
        };
    }

    // API endpoint to get details of a specific organization along with super admin details
    @Get('details')
    async getOrganizationDetails(
        @Query('id') orgId: string
    ): Promise<{ message: string; data: { organization: Organization; superAdmin: User | null } }> {
        const result = await this.organizationService.getOne(orgId);
        
        if (!result) {
            throw new NotFoundException(`Organization with ID "${orgId}" not found`);
        }

        return {
            message: 'Organization details retrieved successfully',
            data: result,
        };
    }

    // API endpoint to update details of a specific organization
    @Patch('edit')
    async updateOrganization(
      @Query('id') orgId: string,
      @Body() updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<{ message: string; data: Organization }> {
      const updatedOrganization = await this.organizationService.updateOrganization(orgId, updateOrganizationDto);
      if (!updatedOrganization) {
        throw new NotFoundException(`Organization with ID "${orgId}" not found`);
      }
      return {
        message: 'Organization updated successfully',
        data: updatedOrganization,
      };
    }

    // API endpoint to delete a specific organization
    @Delete('delete')
    async deleteOne(@Query('id') id: string): Promise<{ message: string }> {
        const deleted = await this.organizationService.deleteOne(id);
        if (!deleted) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
        return {
            message: `Organization status has been updated successfully`,
        };
    }

    // API endpoint to bulk delete organizations
    @Delete('bulk-delete')
    async bulkDeleteOrganizations(@Body('ids') orgIds: string[]) {
      if (!orgIds || orgIds.length === 0) {
        throw new BadRequestException('No organization IDs provided for bulk deletion');
      }

      const updatedOrganizations = await this.organizationService.bulkDelete(orgIds);
      if (updatedOrganizations.length === 0) {
        throw new NotFoundException(`No organizations found for the provided IDs`);
      }
      return {
        status: 'success',
        message: 'Status of Organizations have been updated successfully',
        
      };
    }



// API endpoint to create a new organization with super admin
@Post('create')
async createOrganizationWithSuperAdmin(
  @Body() createOrganizationDto: CreateOrganizationWithSuperAdminDto,
) {
  const { organizationData, superAdminData } = createOrganizationDto;
  
  try {
    // Check if the super admin email already exists
    const existingUser = await this.organizationService.findUserByEmail(superAdminData.email);
    
    if (existingUser) {
      // If the email already exists, throw a ConflictException
      throw new ConflictException('Email already exists');
    }

    // Proceed with creating the organization and super admin
    return await this.organizationService.createOrganizationWithSuperAdmin(organizationData, superAdminData);
    
  } catch (error) {
    // Log the error (you can enhance this by using a logger service)
    console.error('Error occurred while creating organization with super admin:', error);
  
    // Return the error details to the client
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
    
}


