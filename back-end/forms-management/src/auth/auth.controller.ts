/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // API endpoint to register admin
    // @Post('register-admin')
    // async register(@Body() userDto: any): Promise<{message: string}> {
    //     return this.authService.registerAdmin(userDto);
    // }

    // API endpoint to first-time password creation
    @Post('set-password')
    async setPassword(
      @Query('token') token: string,
      @Body('newPassword') newPassword: string,
    ): Promise<{ message: string }> {
      return this.authService.verifyAndSetPassword(token, newPassword);
    }

    // API endpoint to login
    @Post('login')
    async login(@Body('email') email:string, @Body('password') password:string): Promise<{ accessToken: string }> {
      return this.authService.login(email,password);
    }

}
