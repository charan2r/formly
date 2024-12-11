/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from './email.module';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import * as fs from 'fs';
import * as path from 'path';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';
import { PermissionRepository } from 'src/permission/permission.repository';
import { RoleRepository } from 'src/role/role.repository';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';
import { Role } from 'src/model/role.entity';
import { Permission } from 'src/model/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from 'src/model/role-permission.entity';
import { Organization } from 'src/model/organization.entity';
import { User } from 'src/model/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';
import { OrganizationService } from 'src/organization/organization.service';
import { UserService } from 'src/user/user.service';

const keysPath = path.resolve(process.cwd(), 'keys');

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([RolePermission, Role, Permission, Organization, User]),
    EmailModule,
    RolePermissionModule,
    PassportModule,
    JwtModule.register({
      privateKey: fs.readFileSync(path.join(keysPath, 'private.pem')),
      publicKey: fs.readFileSync(path.join(keysPath, 'public.pem')),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '24h'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolePermissionService, PermissionService, RoleService, RoleRepository, PermissionRepository, RolePermissionRepository, UserRepository, OrganizationRepository, UserService, OrganizationService],
  exports: [AuthService],
})
export class AuthModule {}
