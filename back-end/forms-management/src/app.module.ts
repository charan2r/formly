/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationController } from './organization/organization.controller';
import { OrganizationService } from './organization/organization.service';
import { OrganizationModule } from './organization/organization.module';
import { OrganizationRepository } from './organization/organization.repository';
import { Organization } from './entity/organization';
import { User } from './entity/user';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [User, Organization],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Organization, User]),
    OrganizationModule
  ],
  controllers: [AppController, OrganizationController],
  providers: [AppService, OrganizationService, OrganizationRepository],
})
export class AppModule { }