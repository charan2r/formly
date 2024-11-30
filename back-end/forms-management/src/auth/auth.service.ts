/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
//import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './email.service';
import { TokenService } from 'src/auth/token.service';

@Injectable()
export class AuthService {
    constructor( 
        private readonly userService: UserService, 
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService) {}

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

        // Send verification email
        await this.emailService.sendVerificationEmail(email, verificationToken);

        return { message: 'Admin registered successfully. Verification email sent', data: user };
        
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
    async login(email: string, password: string): Promise<{accessToken: string}> {
        const user = await this.userService.getUserByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }


        // Check if user is verified
        if(!user.isVerified) {
            throw new UnauthorizedException('User is not verified');
        }

        // Compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordCorrect) {
            throw new UnauthorizedException('Incorrect Credentials');
        }

        // Generate JWT token
        const payload = { userId: user.id, email: user.email, userType: user.userType, organizationId: user.organizationId };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
