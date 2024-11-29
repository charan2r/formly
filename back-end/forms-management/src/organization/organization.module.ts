/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from 'src/model/organization.entity';  
import { OrganizationRepository } from './organization.repository';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationRepository]),UserModule, AuthModule],
  providers: [OrganizationService, OrganizationRepository,UserRepository],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
