/* eslint-disable prettier/prettier */
import { Organization } from '../model/organization.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';


@Injectable()
export class OrganizationRepository extends Repository<Organization> {

    constructor(private dataSource: DataSource) {
        super(Organization, dataSource.createEntityManager());
      }

    
}