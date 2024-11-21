import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../model/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

import { CategoryRepository } from './category.repository';
import { OrganizationRepository } from 'src/organization/organization.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, CategoryRepository]),
    UserModule,
  ],
  providers: [
    CategoryService,
    CategoryRepository,
    UserRepository,
    OrganizationRepository,
  ],
  exports: [CategoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
