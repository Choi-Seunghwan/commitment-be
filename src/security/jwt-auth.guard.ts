import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): any {
    return super.canActivate(context);
  }
}
