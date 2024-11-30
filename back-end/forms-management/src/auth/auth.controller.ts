/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

interface StandardResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

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
    ): Promise<StandardResponse<{ passwordSet: boolean }>> {
      try {
        const result = await this.authService.verifyAndSetPassword(token, newPassword);
        return {
          success: true,
          data: { passwordSet: true },
          message: result.message || 'Password set successfully'
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message: error.message || 'Failed to set password'
        };
      }
    }

    // API endpoint to login
    @Post('login')
    async login(
      @Body('email') email: string, 
      @Body('password') password: string
    ): Promise<StandardResponse<{ accessToken: string }>> {
      try {
        const result = await this.authService.login(email, password);
        return {
          success: true,
          data: { accessToken: result.accessToken },
          message: 'Login successful'
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message: error.message || 'Login failed'
        };
      }
    }

}
