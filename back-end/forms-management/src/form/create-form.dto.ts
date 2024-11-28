/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Form name

  @IsNotEmpty()
  @IsString()
  description: string; // Form description

  @IsNotEmpty()
  @IsString()
  templateName: string; // Template name

  @IsNotEmpty()
  @IsString()
  templateType: string; // Template type (e.g., "standard", "custom")

  @IsOptional()
  @IsString()
  status?: string; // Optional status for the form
  
  @IsNotEmpty()
  @IsUUID()
  categoryId: string; // Category ID

  @IsNotEmpty()
  @IsUUID()
  formTemplateId: string; 

  
}