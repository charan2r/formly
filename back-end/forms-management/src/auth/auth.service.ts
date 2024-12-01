/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor( 
        private readonly userService: UserService, 
        private readonly jwtService: JwtService) {}

    // Register admin 
    async registerAdmin(userDto: any): Promise<{message:string,data:any}> {
        const {email, firstName,lastName, organizationId } = userDto;
        const candidate = await this.userService.getUserByEmail(email);
        if(candidate) {
            throw new UnauthorizedException('User with this email already exists');
        }

        // Generate verification token
        const verificationToken = uuidv4();
        const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        // Create Admin user
        const newAdmin = await this.userService.addUser({
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

        // Send verification email
        await this.sendVerificationEmail(email, verificationToken);

        return { message: 'Admin registered successfully. Verification email sent', data: newAdmin };
        
    }

    // Send verification email
    async sendVerificationEmail(email: string, token: string) {
        const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;
        console.log(verificationLink);
    }

    // First time verification
    async verifyAndSetPassword(token: string, newPassword: string): Promise<{message: string}> {
        const user = await this.userService.getUserByVerificationToken(token);
        if(!user) {
            throw new UnauthorizedException('Invalid Token');
        }


        // Check if token has expired
        if(!user || user.verificationTokenExpires < new Date()) {
            throw new UnauthorizedException('Token has expired');
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update user
        await this.userService.updateUser(user.id, { 
                passwordHash, 
                isVerified: true, 
                verificationToken: null, 
                verificationTokenExpires: null 
            });

        return { message: 'Password set successfully. You can login now.' };

        
    }


    // Login a user
    async login(email: string, password: string): Promise<{ accessToken: string; user: any }> {
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

        // Generate JWT token
        const payload = {
            userId: user.id,
            email: user.email,
            userType: user.userType,
            organizationId: user.organizationId
        };
        
        const accessToken = this.jwtService.sign(payload);

        // Return user data without sensitive information
        const userData = {
            id: user.id,
            email: user.email,
            userType: user.userType,
            organizationId: user.organizationId
        };

        return { accessToken, user: userData };
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

            // Return user data without sensitive information
            return {
                id: user.id,
                email: user.email,
                userType: user.userType,
                organizationId: user.organizationId
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
