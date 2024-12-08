/* eslint-disable prettier/prettier */
// src/forms/forms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from '../model/form.entity'; 
import { FormsService } from './form.service';
import { FormsController } from './form.controller';
import { FormsRepository } from './form.repository'; 
import { CategoryModule } from 'src/category/category.module'; 
import { CategoryRepository } from 'src/category/category.repository';
import { Permission } from 'src/model/permission.entity';
import { Role } from 'src/model/role.entity';
import { RolePermission } from 'src/model/role-permission.entity';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RoleService } from 'src/role/role.service';
import { PermissionRepository } from 'src/permission/permission.repository';
import { PermissionService } from 'src/permission/permission.service';
import { RoleRepository } from 'src/role/role.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { Organization } from 'src/model/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { User } from 'src/model/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/auth/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormsRepository,Role, Permission, RolePermission, Organization, User ]), CategoryModule],
  controllers: [FormsController],
  providers: [FormsService, FormsRepository, CategoryRepository, RolePermissionService, RoleService, PermissionService, PermissionRepository, RoleRepository, RolePermissionRepository, OrganizationRepository, OrganizationService, UserService, UserRepository, AuthService, JwtService, EmailService],
})
export class FormsModule {}