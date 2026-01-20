/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from 'src/model/organization.entity';  
import { OrganizationRepository } from './organization.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { RolePermission } from 'src/model/role-permission.entity';
import { RoleService } from 'src/role/role.service';
import { RoleRepository } from 'src/role/role.repository';
import { Role } from 'src/model/role.entity';
import { Permission } from 'src/model/permission.entity';
import { PermissionRepository } from 'src/permission/permission.repository';
import { PermissionService } from 'src/permission/permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationRepository,RolePermission,Role,Permission]),UserModule, AuthModule],
  providers: [OrganizationService, OrganizationRepository,UserRepository,RolePermissionService,RolePermissionRepository,RoleService,RoleRepository,PermissionRepository, PermissionService],
  controllers: [OrganizationController],
  exports: [OrganizationService, OrganizationModule]
})
export class OrganizationModule {}
