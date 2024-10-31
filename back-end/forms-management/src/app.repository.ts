/* eslint-disable prettier/prettier */
// organization.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Organization } from './entity/organization';

@Injectable()
export class OrganizationRepository {
  constructor(private dataSource: DataSource) {}

  async findAllOrganizations() {
    return await this.dataSource.getRepository(Organization).find();
  }

  async deleteOrganizationById(id: string) {
    return await this.dataSource.getRepository(Organization).delete(id);
  }
}
