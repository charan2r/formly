/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';   
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}