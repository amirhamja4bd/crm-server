import { UsersRepository } from '@/modules/users/repository/users.repository';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY, RequiredPermission } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.isOrganizationOwner) {
      return true;
    }

    const userWithPermissions = await this.usersRepository.findByIdWithPermissions(user.id);

    if (!userWithPermissions) {
      throw new ForbiddenException('User not found');
    }

    if (userWithPermissions.isSuperAdmin) {
      request.user = userWithPermissions;
      return true;
    }

    if (!userWithPermissions.permissions) {
      throw new ForbiddenException('No permissions found for user');
    }

    request.user = userWithPermissions;

    const hasPermission = requiredPermissions.every((required) =>
      userWithPermissions.permissions?.some(
        (userPerm) =>
          userPerm.resource === required.resource && userPerm.action === required.action,
      ),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions to access this resource');
    }

    return true;
  }
}
