import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRoleService } from "./userRole.service";
import { UserRoleController } from "./userRole.controller";
import { UserRepository } from "src/user/user.repository";
import { RoleRepository } from '../role/role.repository';
import { RoleModule } from '../role/role.module';
import { RoleService } from 'src/role/role.service';
import { UserModule } from "src/user/user.module";
import { UserRoleRepository } from "./userRole.repository";
import { UserService } from "src/user/user.service";
import { UserRole } from "src/model/UserRole.entity";
import { Role } from "src/model/role.entity";
import { User } from "src/model/user.entity";
import { EmailService } from "src/auth/email.service";
import { OrganizationRepository } from "src/organization/organization.repository";
import { RolePermissionService } from "src/role-permission/role-permission.service";
import { RolePermissionRepository } from "src/role-permission/role-permission.repository";
import { RolePermission } from "src/model/role-permission.entity";
import { PermissionRepository } from "src/permission/permission.repository";
import { Permission } from "src/model/permission.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([UserRole,Role,RolePermission,Permission]), RoleModule,UserModule,
    ], 
    controllers: [UserRoleController],
    providers: [RoleService,UserRoleService,RoleService,RoleRepository,UserRepository,UserRoleRepository, UserService, EmailService, OrganizationRepository, RolePermissionService,RolePermissionRepository, PermissionRepository],
    exports:[UserRoleService]
  })
  export class userRoleModule {}