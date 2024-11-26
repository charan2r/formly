/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  name: string; // Title of the form

  @IsNotEmpty()
  @IsUUID()
  formTemplateId: string; // ID of the associated form template

  @IsOptional()
  @IsString()
  status?: string; // Optional status for the form
}