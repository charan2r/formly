/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';   
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/auth/email.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), EmailModule],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}