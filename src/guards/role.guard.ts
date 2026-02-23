import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from '../common/decorators/role.decorator';
import { authConstant } from '../constants/auth.constant';
import { IJwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  // eslint-disable-next-line prettier/prettier
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException(authConstant.TOKEN_MISSING);
    }

    const token = authHeader.replace('Bearer ', '');
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
      req.user = payload.data;
    } catch (error) {
      throw new UnauthorizedException(authConstant.INVALID_TOKEN);
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const userRole = req.user?.role;
    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException(authConstant.UNAUTHORIZED);
    }

    return true;
  }
}
