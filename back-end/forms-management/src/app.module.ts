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
    TypeOrmModule.forFeature([Organization, User, FormTemplate, Category, Role, Permission,RolePermission,AuditTrail]),
    OrganizationModule,
    UserModule,
    FormTemplateModule,
    CategoryModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    AuditTrailModule,

    ClsModule.forRoot({
      global: true,
       //middleware: {
        //mount: true
      //}
    })
  ],
  controllers: [AppController, OrganizationController, FormTemplateController],
  providers: [AppService, OrganizationService, OrganizationRepository,UserRepository, FormTemplateService, FormTemplateRepository, CategoryRepository,RoleRepository,PermissionRepository, RolePermissionRepository,AuditTrailSubscriber,
 AuditTrailRepository
  ],
})
export class AppModule { }