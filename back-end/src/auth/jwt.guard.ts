import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getConnection } from 'typeorm';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    // Store token in connection for subscriber to access
    if (token) {
      const connection = getConnection();
      connection.options['token'] = token;
    }
    
    return super.canActivate(context);
  }
} 