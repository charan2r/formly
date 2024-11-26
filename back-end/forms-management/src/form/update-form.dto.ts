/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  name?: string; // Form name

  @IsOptional()
  @IsString()
  description?: string; // Form description

  @IsOptional()
  @IsString()
  templateName?: string; // Template name

  @IsOptional()
  @IsString()
  templateType?: string; // Template type (e.g., "standard", "custom")

  @IsOptional()
  @IsUUID()
  categoryId?: string; // Category ID

  @IsNotEmpty()
  @IsUUID()
  formTemplateId: string; 

  @IsOptional()
  @IsString()
  status?: string; // Optional status for the form

  @IsOptional()
  @IsString()
  backgroundColor?: string; // Optional background color

  @IsOptional()
  @IsString()
  headerText?: string; // Optional header text

  @IsOptional()
  @IsString()
  headerImageUrl?: string; // Optional header image URL
}