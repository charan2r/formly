/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
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
}
