import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { Permission } from '../model/permission.entity';


@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository,Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService], 
})
export class PermissionModule {}
