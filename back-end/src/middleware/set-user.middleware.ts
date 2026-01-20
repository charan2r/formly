import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class SetUserMiddleware implements NestMiddleware {
  constructor(private clsService: ClsService) {}

  use(req: any, res: any, next: () => void) {
    const user = req.user; // when user is set in the request (via passport or JWT)
    this.clsService.set('user', user);
    next();
  }
}
