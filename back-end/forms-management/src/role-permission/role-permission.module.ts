import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionController } from './role-permission.controller';
import { RolePermissionService } from './role-permission.service';
import { RolePermission } from '../model/role-permission.entity';
import { Role } from '../model/role.entity';
import { Permission } from '../model/permission.entity';
import { RolePermissionRepository } from './role-permission.repository';
import { RoleRepository } from '../role/role.repository';
import { PermissionRepository } from '../permission/permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolePermission,
      Role,
      Permission,
      RolePermissionRepository,
      RoleRepository,
      PermissionRepository
    ]),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService,RolePermissionRepository,RoleService,OrganizationRepository,RoleRepository,PermissionRepository],
  exports:[RolePermissionService]
})
export class RolePermissionModule {}
