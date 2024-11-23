/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateFormFieldDto {
  @IsString()
  question: string;

  @IsString()
  type: string;

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

  @IsUUID()
  formTemplateId: string;
}
