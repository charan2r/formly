// src/category/dto/create-category.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  createdById: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;
}



