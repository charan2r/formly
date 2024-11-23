/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly passwordHash: string; 

  @IsString()
  @IsOptional()
  readonly phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  readonly userType: string;

  @IsString()
  @IsNotEmpty()
  readonly organizationId?: string;
}
