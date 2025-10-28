import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role, type UserResponse } from '@/utils/type';
import { ROLES_KEY } from '@/common/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.getRequiredRoles(context);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<UserResponse>();
    const { user } = request;

    return user?.role !== undefined && requiredRoles.includes(user.role);
  }

  private getRequiredRoles(context: ExecutionContext): Role[] | null {
    return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
