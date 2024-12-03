import { Module } from '@nestjs/common';
import { AuditTrailSubscriber } from '../audit-trails/AuditTrailSubscriber';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../model/role.entity';
import { Permission } from '../model/permission.entity';
import { RolePermission } from '../model/role-permission.entity';
import { AuditTrailRepository } from './AuditTrail.repository';
import { AuditTrail } from '../model/AuditTrail.entity';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { RoleRepository } from '../role/role.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { PermissionService } from '../permission/permission.service';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { PermissionRepository } from '../permission/permission.repository';
import { RolePermissionRepository } from '../role-permission/role-permission.repository';
import { PermissionModule } from '../permission/permission.module';
import { RolePermissionModule } from '../role-permission/role-permission.module';
import { AuditTrailController } from './AuditTrail.controller';
import { AuditTrailService } from './AuditTrail.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { Organization } from 'src/model/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuditTrail, AuditTrailRepository,Permission,Role,RolePermission,Organization]),
        UserModule,
        RoleModule,
        PermissionModule,
        RolePermissionModule,
        AuditTrailModule,
        OrganizationModule,
        AuthModule
      ],
  providers: [
    {
        provide: 'MONITORED_ENTITIES',
        useValue: [Role, Permission, RolePermission,Organization],
    },
    RoleService,
    RoleRepository,
    OrganizationRepository,
    PermissionService,
    RolePermissionService,
    RolePermissionRepository,
    PermissionRepository,
    AuditTrailSubscriber,
    PermissionRepository,
    AuditTrailService,
    AuditTrailRepository,
    OrganizationService
  ],
  controllers:[AuditTrailController],
  exports: [
    {
      provide: 'MONITORED_ENTITIES',
      useValue: [Role, Permission, RolePermission,Organization],
    },
    AuditTrailService
  ],
})
export class AuditTrailModule {}
