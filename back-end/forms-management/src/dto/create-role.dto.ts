import { IsUUID, IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsArray()
  @IsOptional() 
  permissions?: string[];
  
}
