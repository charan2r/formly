import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from '../role-permission/role-permission.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolePermissionService: RolePermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    // If it is Admin
    if (user.userType === 'Admin') {
      if (!orgIdFromRequest) {
        orgIdFromRequest = user.organizationId;
      }

      if (user.organizationId !== orgIdFromRequest) {
        throw new ForbiddenException(
          `Admins can only perform actions on their own organization. You are restricted to organization ID "${user.organizationId}".`
        );
      }
    }

    // If it is User, check permissions
    if (user.userType === 'SubUser') {
      const requiredPermissions = this.reflector.get<string[]>(
        'permissions',
        context.getHandler(),
      );
      if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = await this.rolePermissionService.getRolePermissions(user.roleId);
        const userPermissionNames = userPermissions.map(
          (rp) => rp.permission.name,
        );

        const hasPermission = requiredPermissions.every((permission) =>
          userPermissionNames.includes(permission),
        );
        if (!hasPermission) {
          throw new ForbiddenException(
            'You do not have the required permissions to access this resource.',
          );
        }
      }
    }

    return true;
  }
}
