/* eslint-disable prettier/prettier */

import { Controller, Get, Delete, Param, NotFoundException } from '@nestjs/common';
import { OrganizationService } from './organization.service';

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
        if (result.affected === 0) {
            throw new NotFoundException(`Organization with ID "${id}" not found`);
        }
    }
    
}
