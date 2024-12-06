/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsInt, IsNotEmpty, IsUUID, IsNumber,IsEnum } from 'class-validator';
import { BorderStyle } from 'src/model/form-template.entity';

export class UpdateTemplateDto {
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

  @IsNotEmpty()
  @IsUUID()
  categoryId?: string;

  // New fields added
  @IsOptional()
  @IsString()
  paperSize?: string; // e.g., "A4", "Letter", etc.

  @IsOptional()
  @IsNumber()
  marginTop?: number; // Margin at the top in units like mm or inches

  @IsOptional()
  @IsNumber()
  marginBottom?: number; // Margin at the bottom

  @IsOptional()
  @IsNumber()
  marginLeft?: number; // Margin on the left

  @IsOptional()
  @IsNumber()
  marginRight?: number; // Margin on the right

  @IsOptional()
  @IsNumber()
  borderWidth?: number;

  @IsOptional()
  @IsNumber()
  borderRadius?: number;

  @IsOptional()
  @IsEnum(BorderStyle)
  borderStyle?: BorderStyle;

  @IsOptional()
  @IsString()
  borderColor?: string;

  @IsOptional()
  @IsNumber()
  boxShadowX?: number;

  @IsOptional()
  @IsNumber()
  boxShadowY?: number;

  @IsOptional()
  @IsNumber()
  boxShadowBlur?: number;

  @IsOptional()
  @IsNumber()
  boxShadowSpread?: number;

  @IsOptional()
  @IsString()
  boxShadowColor?: string;

  @IsOptional()
  @IsNumber()
  boxShadowOpacity?: number;
}
