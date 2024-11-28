/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // API endpoint to register a new user
    @Post('register')
    async register(@Body() userDto: any): Promise<{message: string}> {
        return this.authService.register(userDto);
    }

    // API endpoint to login a user
    @Post('login')
    async login(@Body('email') email: string,@Body('password') password: string,): Promise<{ accessToken: string }> {
        return this.authService.login(email, password);
    }

}
