/* eslint-disable prettier/prettier */
import { Controller, UseGuards,Get, Delete, Post, Request, NotFoundException, Query, Patch, Body, BadRequestException, HttpException, HttpStatus, ConflictException} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from 'src/model/organization.entity';
import { UpdateOrganizationDto } from './organization.dto';
//import { CreateOrganizationWithSuperAdminDto } from '../user/create-organization.dto';
import { User } from 'src/model/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';
import { Roles } from 'src/user/roles.decorator';

@Controller('organization')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protect all routes with JWT authentication
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    // API endpoint to get all organizations
    @Get()
    @Roles("SuperAdmin")
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
    @Roles("SuperAdmin")
    async getOrganizationDetails(
        @Query('id') orgId: string | undefined,
        @Request() req: any
    ): Promise<{ status: string; message: string; data: { organization: Organization; superAdmin: User | null } }> {
      const result = await this.organizationService.getOne(orgId);
      const user: User = req.user;

      if (!result) {
        throw new NotFoundException(`Organization with ID "${orgId}" not found`);
      }

      return {
            status: 'success',
            message: 'Organization details retrieved successfully',
            data: result,
        };
    }

    // API endpoint to update details of a specific organization
    @Patch('edit')
    @Roles("SuperAdmin")
    async updateOrganization(
      @Query('id') orgId: string,
      @Body() updateOrganizationDto: UpdateOrganizationDto,
    ): Promise<{ status: string; message: string; data: Organization }> {
      const updatedOrganization = await this.organizationService.updateOrganization(orgId, updateOrganizationDto);
      if (!updatedOrganization) {
        throw new NotFoundException(`Organization with ID "${orgId}" not found`);
      }
      return {
        status: 'success',
        message: 'Organization updated successfully',
        data: updatedOrganization,
      };
    }

    // API endpoint to delete a specific organization
    @Delete('delete')
    @Roles("SuperAdmin")
    async deleteOne(@Query('id') id: string): Promise<{ status: string; message: string }> {
        const deleted = await this.organizationService.deleteOne(id);
        if (!deleted) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
        return {
            status: 'success',
            message: `Organization status has been updated successfully`,
        };
    }

    // API endpoint to bulk delete organizations
    @Delete('bulk-delete')
    @Roles("SuperAdmin")
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
        data: updatedOrganizations
      };
    }

    // API endpoint to create a new organization with super admin
    @Post('create')
    @Roles("SuperAdmin")
    async createOrganizationWithSuperAdmin(
      @Body('organizationData') organizationData: any,
      @Body('superAdminData') superAdminData: any,
    ): Promise<{ status: string; message: string; data: Organization }> {
      try {
        // Check if the super admin email already exists
        const existingUser = await this.organizationService.findUserByEmail(superAdminData.email);
        
        if (existingUser) {
          // If the email already exists, throw a ConflictException
          throw new ConflictException('Email already exists');
        }

        // Proceed with creating the organization and super admin
        const result = await this.organizationService.createOrganizationWithSuperAdmin(organizationData, superAdminData);
        return {
          status: 'success',
          message: 'Organization created successfully',
          data: result
        };
      }
      catch (error) {
        // Log the error (you can enhance this by using a logger service)
        console.error('Error occurred while creating organization with super admin:', error);
      
        // Return the error details to the client
        throw new HttpException({
          status: 'error',
          message: error.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Patch('change-admin')
    @Roles("SuperAdmin")
    async changeOrganizationAdmin(
      @Query('orgId') orgId: string,
      @Body() adminData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      },
    ): Promise<{ status: string; message: string; data: any }> {
      try {
        const result = await this.organizationService.changeOrganizationAdmin(
          orgId,
          adminData
        );
        return {
          status: 'success',
          message: 'Organization admin changed successfully',
          data: result
        };
      } catch (error) {
        throw new HttpException({
          status: 'error',
          message: error.message,
        }, HttpStatus.BAD_REQUEST);
      }
    }

    @Get('user-types-count')
    @Roles("SuperAdmin")
    async getUserTypesCounts(): Promise<{ status: string; message: string; data: any }> {
      try {
        const user = req.user;
        const organizationId = user.userType === 'Admin' ? user.organizationId : null;
        const counts = await this.organizationService.getUserTypesCounts(user);
        return {
          status: 'success',
          message: 'User types count retrieved successfully',
          data: counts
        };
      } catch (error) {
        throw new HttpException({
          status: 'error',
          message: error.message,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
}
