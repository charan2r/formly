/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Organization } from './entity/organization'; 
import { User } from './entity/user';
import AppDataSource from 'ormconfig'; 
import { OrganizationRepository } from './app.repository';
//import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options), 
    TypeOrmModule.forFeature([Organization, User]),
  ],
  controllers: [AppController],
  providers: [AppService, OrganizationRepository],
})
export class AppModule {}
