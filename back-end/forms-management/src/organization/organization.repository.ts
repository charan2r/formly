/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { Organization } from '../model/organization.entity';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {}
