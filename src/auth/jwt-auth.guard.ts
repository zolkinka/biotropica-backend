import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'src/auth/auth.header';

const ERROR_MESSAGE: string = 'User unauthorized';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      return this.validateRequest(request);
    } catch (e) {
      throw new UnauthorizedException({ message: ERROR_MESSAGE });
    }
  }

  validateRequest(request: Request): boolean {
    const token = request.cookies.Bearer;

    if (!token) {
      throw new UnauthorizedException({ message: ERROR_MESSAGE });
    }

    const user = this.jwtService.verify(token);
    request.user = user;

    return true;
  }
}
