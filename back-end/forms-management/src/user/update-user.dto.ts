/* eslint-disable prettier/prettier */
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly passwordHash?: string;

  @IsString()
  @IsOptional()
  readonly isVerified?: boolean;

  @IsString()
  @IsOptional()
  readonly verificationToken?: string;

  @IsString()
  @IsOptional()
  readonly verificationTokenExpires?: Date;

  @IsString()
  @IsOptional()
  readonly phoneNumber?: string;

  @IsString()
  @IsOptional()
  readonly userType?: string;

  @IsString()
  @IsOptional()
  readonly organizationId?: string;

  @IsString()
  @IsOptional()
  readonly roleId?: string;
}
