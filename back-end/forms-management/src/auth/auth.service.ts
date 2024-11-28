/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor( 
        private readonly userService: UserService, 
        private readonly jwtService: JwtService) {}

    // Register a new user  
    async register(userDto: any): Promise<{message:string}> {
        const {email, password, } = userDto;
        const candidate = await this.userService.getUserByEmail(email);
        if(candidate) {
            throw new UnauthorizedException('User with this email already exists');
        }
        
        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10); 
        const newUser = await this.userService.addUser({
            ...userDto,
            passwordHash: hashPassword,
          });

        // Generate JWT token
        const payload = {email: newUser.email, id: newUser.id};
        const accessToken = this.jwtService.sign(payload);
        return { message: 'Registration successful. Please log in to continue.' };
    }



    // Login a user
    async login(email: string, password: string): Promise<{accessToken: string}> {
        const user = await this.userService.getUserByEmail(email);
        if(!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        // Compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordCorrect) {
            throw new UnauthorizedException('Incorrect Credentials');
        }

        // Generate JWT token
        const payload = { userId: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}
