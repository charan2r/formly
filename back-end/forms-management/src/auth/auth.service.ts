/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
//import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './email.service';
import { TokenService } from 'src/auth/token.service';
import { Request } from 'express';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { PermissionService } from '../permission/permission.service';
import { first } from 'rxjs';
import { OrganizationService } from 'src/organization/organization.service';

@Injectable()
export class AuthService {
    constructor( 
        private readonly userService: UserService, 
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
        private readonly rolePermissionService: RolePermissionService,
        private readonly permissionService: PermissionService,
        // private readonly organizationService: OrganizationService,
    ) {}

    // Register admin 
    async registerAdmin(userDto: any): Promise<{message:string, data: any}> {
        const {email, firstName,lastName, organizationId } = userDto;
        const candidate = await this.userService.getUserByEmail(email);
        if(candidate) {
            throw new UnauthorizedException('User with this email already exists');
        }

        // Generate verification token
        const { verificationToken, verificationTokenExpires } = TokenService.generateVerificationToken();

        // Create Admin user
        const user = await this.userService.addUser({
            email,
            firstName,
            lastName,
            organizationId,
            userType: 'Admin',
            isVerified: false,
            verificationToken,
            verificationTokenExpires,
            passwordHash: ''
        });

        console.log(user);

        return { message: 'Admin registered successfully. Verification email sent', data: user };
        
    }


    // First time verification 
    async verifyAndSetPassword(token: string, newPassword: string): Promise<{message: string}> {
        console.log('1---------------');
        console.log(token);
        const user = await this.userService.getUserByVerificationToken(token);
        console.log(user);
        if(!user) {
            throw new UnauthorizedException('Invalid Token');
        }
        
        
        console.log('2---------------');
        // Check if token has expired
        // if(!user || user.verificationTokenExpires < new Date()) {
        //     throw new UnauthorizedException('Token has expired');
        // }
        
        console.log('3---------------');
        // Hash the password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        console.log('4---------------');
        // Update user
        const response = await this.userService.updateUser(user.id, { 
                passwordHash, 
                isVerified: true, 
                verificationToken: null, 
                verificationTokenExpires: null 
            });

  

        console.log(response)

        return { message: 'Password set successfully. You can login now.' };
 
    }

    // Forgot Password
    async forgotPassword(email: string): Promise<{message: string}> {
        const user = await this.userService.getUserByEmail(email);
        if(!user) {
            throw new UnauthorizedException('User with this email does not exist');
        }

        // Generate verification token
        const { verificationToken, verificationTokenExpires } = TokenService.generateVerificationToken();

        // Update user
        await this.userService.updateUser(user.id, { verificationToken, verificationTokenExpires });

        // Send verification email
        await this.emailService.sendForgotPasswordEmail(email, verificationToken);

        return { message: 'Password reset email sent' };
    }


    // Login 
    async login(email: string, password: string): Promise<{accessToken: string, user: any}> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('User is not verified');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Initialize permissions array
        let permissions = [];

        // Only fetch permissions if roleId exists
        if (user.roleId) {
            // Fetch user's permission IDs based on their role
            const rolePermissions = await this.rolePermissionService.getRolePermissions(user.roleId);
            
            if (rolePermissions && rolePermissions.length > 0) {
                // Get permission IDs from role permissions
                const permissionIds = rolePermissions.map(rp => rp.permissionId);
                
                // Fetch actual permissions using permission IDs
                for (const permissionId of permissionIds) {
                    const permission = await this.permissionService.getPermissionById(permissionId);
                    permissions.push(permission.name);
                }
            }
        }
        // const org = await this.organizationService.getOne(user.organizationId)

        // Generate JWT token with permissions (will be empty array if no roleId)
        const payload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            roleId: user.roleId,
            organizationId: user.organizationId,
            // organizationName: org.organization.name,
            permissions: permissions
        };
        
        const accessToken = this.jwtService.sign(payload);

        // Return user data without sensitive information
        const userData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
            roleId: user.roleId,
            organizationId: user.organizationId,
            // organizationName: org.organization.name,
            permissions: permissions
        };
        console.log(userData);

        return {
            accessToken,
            user: userData
        };
    }

    async validateUser(request: Request): Promise<any> {
        try {
            const token = request.cookies['accessToken'];
            if (!token) {
                throw new UnauthorizedException('No token provided');
            }

            const decoded = this.jwtService.verify(token);
            const user = await this.userService.getUserById(decoded.userId);
            
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Initialize permissions array
            let permissions = [];
            console.log('----------------------',permissions);

            // const org = await this.organizationService.getOne(user.organizationId)
            
            // Only fetch permissions if roleId exists
            if (user.roleId) {
                // Fetch user's permission IDs based on their role
                const rolePermissions = await this.rolePermissionService.getRolePermissions(user.roleId);
                
                if (rolePermissions && rolePermissions.length > 0) {
                    // Get permission IDs from role permissions
                    const permissionIds = rolePermissions.map(rp => rp.permissionId);
                    
                    // Fetch actual permissions using permission IDs
                    for (const permissionId of permissionIds) {
                        const permission = await this.permissionService.getPermissionById(permissionId);
                        permissions.push(permission.name);
                        }
                        }
                        }
                        
            console.log('2. ----------------------',permissions);
            // Return user data without sensitive information
            return {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                roleId: user.roleId,
                organizationId: user.organizationId,
                // organizationName: org.organization.name,
                permissions: permissions
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
