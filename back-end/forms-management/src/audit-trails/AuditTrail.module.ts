import { Module, Scope } from '@nestjs/common';
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
import { UserRoleService } from 'src/userRole/userRole.service';
import { UserRepository } from 'src/user/user.repository';
import { UserRoleRepository } from 'src/userRole/userRole.repository';
import { User } from 'src/model/user.entity';
import { UserRole } from 'src/model/UserRole.entity';
import { userRoleModule } from 'src/userRole/userRole.module';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuditTrail, AuditTrailRepository,Permission,Role,RolePermission,Organization,User,UserRole]),
        UserModule,
        RoleModule,
        PermissionModule,
        RolePermissionModule,
        OrganizationModule,
        AuthModule,
        userRoleModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [
        {
            provide: 'MONITORED_ENTITIES',
            useValue: [Role, Permission, RolePermission,Organization,User,UserRole],
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
        OrganizationService,
        UserRoleService,
        UserRepository,
        UserRoleRepository,
        {
            provide: REQUEST,
            useFactory: (req: Request) => req,
            inject: [REQUEST],
            scope: Scope.REQUEST,
        },
        JwtService,
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
