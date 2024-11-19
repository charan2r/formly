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
import { FormTemplateController } from './form-template/form-template.controller';
import { FormTemplateService } from './form-template/form-template.service';
import { FormTemplateModule } from './form-template/form-template.module';
import { FormTemplate } from './model/form-template.entity';
import { FormTemplateRepository } from './form-template/form-template.repository';
import { CategoryModule } from './category/category.module';
import { CategoryRepository } from './category/category.repository';
import { Category } from './model/category.entity';
import { FormFieldsModule } from './form-fields/form-fields.module';
import { FormFieldsRepository } from './form-fields/form-fields.repository';
import { FormField } from './model/form-fields.entity';
import { FormFieldsService } from './form-fields/form-fields.service';
import { FormFieldsController } from './form-fields/form-fields.controller';

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
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User, FormTemplate, Category, FormField]),
    OrganizationModule,
    UserModule,
    FormTemplateModule,
    CategoryModule,
    FormFieldsModule
  ],
  controllers: [AppController, OrganizationController, FormTemplateController, FormFieldsController],
  providers: [AppService, OrganizationService, OrganizationRepository,UserRepository, FormTemplateService, FormTemplateRepository, CategoryRepository, FormFieldsRepository, FormFieldsService],
})
export class AppModule { }