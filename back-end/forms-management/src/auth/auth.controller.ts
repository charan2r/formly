/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.strategy';
import { Response, Request } from 'express';

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

    // API endpoint to forgot password
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
      return this.authService.forgotPassword(email);
    }

    // API endpoint to login
    @Post('login')
    async login(
      @Body('email') email: string,
      @Body('password') password: string,
      @Res({ passthrough: true }) response: Response,
    ): Promise<StandardResponse<{ user: any }>> {
      try {
        const { accessToken, user } = await this.authService.login(email, password);

        // Set cookie with the token
        response.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        return {
          success: true,
          data: { user },
          message: 'Login successful'
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          message: error.message
        };
      }
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getCurrentUser(@Req() request: Request) {
      const user = request.user;
      return {
        success: true,
        data: { user },
        message: 'User retrieved successfully'
      };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
      response.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      
      return {
        success: true,
        data: null,
        message: 'Logged out successfully'
      };
    }

}
