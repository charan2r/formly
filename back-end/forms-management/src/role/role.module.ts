import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { Role } from '../model/role.entity';
import { Organization } from '../model/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository'; 
import { OrganizationModule } from 'src/organization/organization.module';


@Module({
  imports: [TypeOrmModule.forFeature([Role ,RoleRepository, Organization]),OrganizationModule],
  controllers: [RoleController],
  providers: [RoleService,RoleRepository,OrganizationRepository],
  exports:[RoleService],
})
export class RoleModule {}
  