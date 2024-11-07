/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';   
import { UserRepository } from './user.repository';


@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}