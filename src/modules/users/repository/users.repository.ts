import { permissions } from '@/modules/permissions/schemas/schema';
import { role_permissions } from '@/modules/role_permissions/schemas/schema';
import { roles } from '@/modules/roles/schemas/schema';
import { user_roles } from '@/modules/user_roles/schemas/schema';
import { BaseRepository } from '@/shared/base-classes/base.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { and, count, eq, ne, or, SQL } from 'drizzle-orm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class UsersRepository extends BaseRepository<
  typeof schema,
  typeof schema.users.$inferSelect,
  CreateUserDto,
  UpdateUserDto
> {
  constructor() {
    super(schema, schema.users, ['email', 'name'], []);
  }

  async findByEmailOrUsername(identifier: string) {
    return this.findOne(
      or(eq(this.table.email, identifier), eq(this.table.username, identifier)) as SQL,
    );
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.update(userId, { id: userId, refreshToken } as UpdateUserDto);
  }

  async clearRefreshToken(userId: string) {
    return this.update(userId, { id: userId, refreshToken: '' } as UpdateUserDto);
  }

  async findByRefreshToken(refreshToken: string) {
    return this.findOne(eq(this.table.refreshToken, refreshToken));
  }

  async findByIdWithPermissions(userId: string) {
    const result = await this.db
      .select({
        user: schema.users,
        role: {
          isSuperAdmin: roles.isSuperAdmin,
        },
        permission: {
          resource: permissions.resource,
          action: permissions.action,
        },
      })
      .from(schema.users)
      .leftJoin(user_roles, eq(schema.users.id, user_roles.userId))
      .leftJoin(roles, eq(user_roles.roleId, roles.id))
      .leftJoin(role_permissions, eq(roles.id, role_permissions.roleId))
      .leftJoin(permissions, eq(role_permissions.permissionId, permissions.id))
      .where(eq(schema.users.id, userId));

    if (result.length === 0) {
      return null;
    }

    const user = result[0].user;
    const hasSuperAdminRole = result.some((row) => row.role?.isSuperAdmin === true);
    const userPermissions = result
      .filter((row) => row.permission && row.permission.resource && row.permission.action)
      .map((row) => ({
        resource: row.permission!.resource,
        action: row.permission!.action,
      }));

    return {
      ...user,
      permissions: userPermissions,
      isSuperAdmin: hasSuperAdminRole,
    };
  }

  async countUsersInOrganization(organizationId: string): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(schema.users)
      .where(
        and(eq(schema.users.organizationId, organizationId), eq(schema.users.isDeleted, false)),
      );
    return result[0]?.count || 0;
  }

  async checkUniqueInOrganization(
    organizationId: string,
    email: string,
    username: string,
    mobile: string,
    excludeUserId?: string,
  ) {
    const baseConditions: SQL[] = [
      eq(this.table.organizationId, organizationId),
      eq(this.table.isDeleted, false),
    ];

    const orCondition = or(
      eq(this.table.email, email),
      eq(this.table.username, username),
      eq(this.table.mobile, mobile),
    ) as SQL;

    if (excludeUserId) {
      baseConditions.push(ne(this.table.id, excludeUserId));
    }

    const whereCondition = and(...baseConditions, orCondition);

    const existing = await this.db
      .select()
      .from(this.table)
      .where(whereCondition)
      .limit(1);

    if (existing.length > 0) {
      const user = existing[0] as any;
      const conflicts: string[] = [];
      if (user.email === email) conflicts.push('email');
      if (user.username === username) conflicts.push('username');
      if (user.mobile === mobile) conflicts.push('mobile');
      throw new BadRequestException(
        `User with this ${conflicts.join(', ')} already exists in organization`,
      );
    }
  }

  async create(createDto: any) {
    if (createDto.organizationId) {
      await this.checkUniqueInOrganization(
        createDto.organizationId,
        createDto.email,
        createDto.username,
        createDto.mobile,
      );
    }
    return super.create(createDto);
  }
}
