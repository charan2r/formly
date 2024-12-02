import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      throw new ForbiddenException('Access denied: Roles not defined.');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let orgIdFromRequest = request.query.id || request.body?.organizationId;

    // Check if the user has the correct role
    if (!roles.includes(user.userType)) {
      throw new ForbiddenException('You do not have permission to access this resource.');
    }

    return true;
  }
}
