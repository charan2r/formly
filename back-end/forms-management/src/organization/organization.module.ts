/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from '../model/organization.entity';    
import { OrganizationRepository } from './organization.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationRepository])],
  providers: [OrganizationService, OrganizationRepository],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
