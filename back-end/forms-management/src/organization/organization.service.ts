/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { Organization } from '../model/organization.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
    
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: Repository<Organization>,
  ) {}

    async getAll(): Promise<Organization[]> {
        console.log(this.organizationRepository);
        return this.organizationRepository.find();
    }

    async deleteAll(id: string): Promise<void> {
      const result = await this.organizationRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Organization with ID "${id}" not found`);
      }
    }
}
