// create-organization.dto.ts
import { IsNotEmpty, IsOptional, IsEmail, IsString } from 'class-validator';

export class OrganizationDataDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    zip?: string;

    @IsOptional()
    @IsString()
    website?: string;
}

export class SuperAdminDataDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsNotEmpty()
    @IsString()
    passwordHash: string; // Ensure the password hash is not empty when sent
}

export class CreateOrganizationWithSuperAdminDto {
    @IsNotEmpty()
    organizationData: OrganizationDataDto;

    @IsNotEmpty()
    superAdminData: SuperAdminDataDto;
}
