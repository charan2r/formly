import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionRepository } from './role-permission.repository';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from '../permission/permission.repository';
import { RolePermission } from 'src/model/role-permission.entity';  
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module'
import { RoleService } from 'src/role/role.service';
import { OrganizationRepository } from 'src/organization/organization.repository'; 


@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission,RolePermissionRepository]), RoleModule,PermissionModule
  ], 
  controllers: [RolePermissionController],
  providers: [RolePermissionService,RolePermissionRepository,RoleService,OrganizationRepository,RoleRepository,PermissionRepository],
  exports:[RolePermissionService]
})
export class RolePermissionModule {}
