/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class UpdateFormDto {
  @IsOptional()
  @IsString()
  title?: string; // Optional title of the form

  @IsOptional()
  @IsString()
  description?: string; // Optional description of the form

  @IsOptional()
  @IsUUID()
  categoryId?: string; // Optional ID of the category the form belongs to

  @IsOptional()
  @IsString()
  backgroundColor?: string; // Optional background color for the form

  @IsOptional()
  @IsString()
  headerText?: string; // Optional header text for the form

  @IsOptional()
  @IsString()
  headerImageUrl?: string; // Optional URL for a header image

  // Additional fields can be added as necessary
}