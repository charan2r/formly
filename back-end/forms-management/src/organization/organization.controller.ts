/* eslint-disable prettier/prettier */

import { Controller, Get, Delete, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization } from '../model/organization.entity';
import { User } from '../model/user.entity';
import { CreateOrganizationWithSuperAdminDto } from 'src/dto/create-organization.dto';

@Controller('organization')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}
    
    @Get()
    async getAll() {
        return this.organizationService.getAll();
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: string): Promise<void> {
        const result = await this.organizationService.deleteOne(id);
        if (result.data.affected === 0) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
    }

    @Post('create')
    async createOrganizationWithSuperAdmin(
        @Body() createOrganizationDto: CreateOrganizationWithSuperAdminDto,
    ) {
        const { organizationData, superAdminData } = createOrganizationDto;
        return this.organizationService.createOrganizationWithSuperAdmin(organizationData, superAdminData);
    }
}
