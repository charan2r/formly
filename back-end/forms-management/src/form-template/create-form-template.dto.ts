/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID } from 'class-validator';

export class CreateFormTemplateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  version: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  headerText?: string;

  @IsOptional()
  @IsString()
  headerImageUrl?: string;

  @IsOptional()
  @IsString()
  questionFontStyle?: string;

  @IsOptional()
  @IsString()
  questionTextColor?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  headerImage?: string;

  @IsOptional()
  @IsString()
  logoImage?: string;

  @IsOptional() 
  @IsUUID()
  categoryId?: string; 
}
