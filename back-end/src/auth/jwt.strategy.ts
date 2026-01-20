/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { first, Observable } from 'rxjs';

const keysPath = path.resolve(process.cwd(), 'keys');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const publicKey = fs.readFileSync(path.join(keysPath, 'public.pem'));
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.accessToken || null;
      },
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.userId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      userType: payload.userType,
      organizationId: payload.organizationId,
      // organizationName: payload.organizationName,
      roleId: payload.roleId,
      permissions: payload.permissions
    };
  }
}

@Injectable()
export class 
JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}