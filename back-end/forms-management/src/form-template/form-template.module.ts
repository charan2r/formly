/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from '../model/form-template.entity';
import { FormTemplateService } from './form-template.service';
import { FormTemplateController } from './form-template.controller';
import { FormTemplateRepository } from './form-template.repository';
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
  imports: [TypeOrmModule.forFeature([FormTemplate, FormTemplateRepository,Role, Permission, RolePermission, Organization, User ]), CategoryModule],
  controllers: [FormTemplateController],
  providers: [FormTemplateService, FormTemplateRepository, CategoryRepository, RolePermissionService, RoleService, PermissionService, PermissionRepository, RoleRepository, RolePermissionRepository, OrganizationRepository, OrganizationService, UserService, UserRepository, AuthService, JwtService, EmailService],
})
export class FormTemplateModule {}

