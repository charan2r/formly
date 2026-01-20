import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      req.token = token; // Attach token to request object
    }
    next();
  }
}
