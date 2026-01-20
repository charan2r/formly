/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../model/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

import { CategoryRepository } from './category.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { RolePermission } from 'src/model/role-permission.entity';
import { Role } from 'src/model/role.entity';
import { Permission } from 'src/model/permission.entity';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { RoleService } from 'src/role/role.service';
import { RoleRepository } from 'src/role/role.repository';
import { PermissionService } from 'src/permission/permission.service';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { PermissionRepository } from 'src/permission/permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryRepository,RolePermission,Role,Permission]),
    UserModule,
  ],
  providers: [
    CategoryService,
    CategoryRepository,
    UserRepository,
    OrganizationRepository,
    RolePermissionService,
    RoleService,
    PermissionService,
    RolePermissionRepository,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
