/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';
import { OrganizationRepository } from './organization/organization.repository';
import { Organization } from './model/organization.entity';
import { User } from './model/user.entity';
import { UserRepository } from './user/user.repository';
import { UserModule } from './user/user.module';
import { Category } from './model/category.entity'; 
import { CategoryModule } from './category/category.module';
import { FormTemplateController } from './form-template/form-template.controller';
import { FormTemplateService } from './form-template/form-template.service';
import { FormTemplateModule } from './form-template/form-template.module';
import { FormTemplate } from './model/form-template.entity';
import { FormTemplateRepository } from './form-template/form-template.repository';
import { CategoryRepository } from './category/category.repository';
import { FormFieldsModule } from './form-fields/form-fields.module';
import { FormFieldsRepository } from './form-fields/form-fields.repository';
import { FormField } from './model/form-fields.entity';
import { FormFieldsService } from './form-fields/form-fields.service';
import { FormFieldsController } from './form-fields/form-fields.controller';
import { FormFieldsOptionsController } from './form-fields-options/form-fields-options.controller';
import { FormFieldsOptionsService } from './form-fields-options/form-fields-options.service';
import { FormFieldsOptionsModule } from './form-fields-options/form-fields-options.module';
import { FormFieldsOptionsRepository } from './form-fields-options/form-fields-options.repository';
import { FormFieldsOption } from './model/form-fields-option.entity';
import { AuthModule } from './auth/auth.module';
import { Role } from './model/role.entity';
import { RoleModule } from './role/role.module';
import { RoleRepository } from './role/role.repository';
import { PermissionModule } from '../src/permission/permission.module'
import { Permission } from './model/permission.entity';
import { PermissionRepository } from './permission/permission.repository';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { RolePermission } from '../src/model/role-permission.entity'
import { RolePermissionRepository } from '../src/role-permission/role-permission.repository';
import { AuditTrailSubscriber } from './audit-trails/AuditTrailSubscriber';
import { AuditTrail} from './model/Audittrail.entity';
import { ClsModule } from 'nestjs-cls';
import { AuditTrailModule } from './audit-trails/AuditTrail.module';
import { AuditTrailRepository } from './audit-trails/AuditTrail.repository';
import { UserRole } from './model/UserRole.entity';
import { userRoleModule } from './userRole/userRole.module';
import { UserRoleRepository } from './userRole/userRole.repository';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      subscribers: [AuditTrailSubscriber],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User, FormTemplate, Category, FormField, FormFieldsOption, Role, Permission,RolePermission,AuditTrail, UserRole]),
    OrganizationModule,
    UserModule,
    FormTemplateModule,
    CategoryModule,
    FormFieldsModule,
    FormFieldsOptionsModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    AuditTrailModule,
    userRoleModule,

    ClsModule.forRoot({
      global: true,
       middleware: {
        mount: true
      }
    })
  ],
  controllers: [AppController, OrganizationController, FormTemplateController, FormFieldsController, FormFieldsOptionsController],
  providers: [AppService, OrganizationService, OrganizationRepository,UserRepository, FormTemplateService, FormTemplateRepository, CategoryRepository, FormFieldsRepository, FormFieldsService, FormFieldsOptionsService, FormFieldsOptionsRepository,RoleRepository,PermissionRepository, RolePermissionRepository,AuditTrailSubscriber,
 AuditTrailRepository,UserRoleRepository
  ],
})
export class AppModule { }