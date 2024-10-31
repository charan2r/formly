/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { Organization } from './entity/organization';
import { OrganizationRepository } from './app.repository';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello!';
  }

  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async findAll(): Promise<Organization[]> {
    return await this.organizationRepository.findAllOrganizations();
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.organizationRepository.deleteOrganizationById(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
  }
}


