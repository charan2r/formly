import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { Permission } from '../model/permission.entity';
import { RolePermission } from 'src/model/role-permission.entity';
import { Role } from 'src/model/role.entity';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RoleService } from 'src/role/role.service';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { RoleRepository } from 'src/role/role.repository';
import { Organization } from 'src/model/organization.entity';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { OrganizationService } from 'src/organization/organization.service';
import { User } from 'src/model/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/auth/email.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository,Permission, RolePermission, Role,Organization, User])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository, RolePermissionService, RoleService, RolePermissionRepository, RoleRepository, OrganizationRepository, OrganizationService, UserService, UserRepository, AuthService, EmailService, JwtService],
  exports: [PermissionService], 
})
export class PermissionModule {}
