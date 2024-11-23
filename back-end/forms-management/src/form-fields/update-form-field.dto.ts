/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateFormFieldDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  width?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  formTemplateId?: string;
}
