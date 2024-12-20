/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';   
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/auth/email.module';
import { RolesGuard } from './roles.guard';
import { RolePermissionModule } from '../role-permission/role-permission.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), EmailModule, RolePermissionModule],
  providers: [UserRepository, UserService, RolesGuard],
  exports: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}