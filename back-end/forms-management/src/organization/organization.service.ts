/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { Organization } from '../model/organization.entity';
import { DeleteResult } from 'typeorm';
//import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
    
  constructor(
    private organizationRepository:OrganizationRepository,
  ) {}

    async getAll(): Promise<Organization[]> {
        console.log(this.organizationRepository);
        return this.organizationRepository.find();
    }


  async deleteOne(id: string): Promise<DeleteResult> {
    return this.organizationRepository.delete(id);
}
}
