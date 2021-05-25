import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthHeader, Request } from 'src/auth/auth.header';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { ROLES_KEY } from './roles.decorator';

const ERROR_MESSAGE: string = 'Access is denied';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );
      if (!requiredRoles) {
        return true;
      }

      const request: Request = context.switchToHttp().getRequest();
      const authHeader = new AuthHeader(request);
      const token = authHeader.getValidToken();

      if (!token) {
        throw new HttpException(ERROR_MESSAGE, HttpStatus.FORBIDDEN);
      }

      const user = this.jwtService.verify(token);
      request.user = user;

      return this.matchRoles(requiredRoles, user.roles);
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE, HttpStatus.FORBIDDEN);
    }
  }

  matchRoles(requiredRoles: string[], userRoles: CreateRoleDto[]): boolean {
    const verify = userRoles.some((role) => requiredRoles.includes(role.name));
    if (!verify) {
      throw new HttpException(ERROR_MESSAGE, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
