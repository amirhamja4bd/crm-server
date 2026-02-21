import { DATABASE_CONNECTION } from '@/database/database-connection';
import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { roles } from '@/modules/roles/schemas/schema';
import { user_roles } from '@/modules/user_roles/schemas/schema';
import { User_rolesService } from '@/modules/user_roles/services/user_roles.service';
import { BaseService } from '@/shared/base-classes/base.service';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { BcryptService } from 'src/lib/bcrypt/bcrypt.service';
import { JwtTokenService } from 'src/lib/jwt-token/jwt-token.service';
import type { DrizzleDB } from '@/shared/types/drizzle';
import { CreateOrganizationUserDto, CreateUserDto, LoginDto, UpdateUserDto } from '../dtos';
import { UsersRepository } from '../repository/users.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class UsersService extends BaseService<
  typeof schema,
  typeof schema.users.$inferSelect,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DrizzleDB,
    private readonly usersRepository: UsersRepository,
    private readonly bcrypt: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly organizationsService: OrganizationsService,
    private readonly userRolesService: User_rolesService,
  ) {
    super(usersRepository);
  }

  async createWithTransaction(payload: CreateUserDto) {
    const hasId = !!payload.organizationId;
    const hasName = !!payload.organizationName?.trim();

    if (hasId && hasName) {
      throw new BadRequestException(
        'Provide only one of organizationId or organizationName',
      );
    }
    if (!hasId && !hasName) {
      throw new BadRequestException(
        'Either organizationId or organizationName is required',
      );
    }

    return await this.db.transaction(async (tx) => {
      let organizationId = payload.organizationId;

      if (hasName) {
        const org = await this.organizationsService.getOrCreateByName(
          payload.organizationName!.trim(),
        );
        organizationId = org.id;
      }

      const userCountResult = await tx
        .select()
        .from(schema.users)
        .where(
          and(
            eq(schema.users.organizationId, organizationId!),
            eq(schema.users.isDeleted, false),
          ),
        );

      const isFirstUser = userCountResult.length === 0;

      const hashedPassword = await this.bcrypt.hashPassword(
        payload.password,
      );
      const { organizationName: _, roleIds, ...rest } = payload;

      const [user] = await tx
        .insert(schema.users)
        .values({
          ...rest,
          password: hashedPassword,
          organizationId: organizationId!,
          isOrganizationOwner: isFirstUser,
        } as any)
        .returning();

      if (!user) {
        throw new BadRequestException('Failed to create user');
      }

      if (isFirstUser) {
        const [adminRole] = await tx
          .insert(roles)
          .values({
            name: 'Admin',
            organizationId: organizationId!,
            isSuperAdmin: false,
          } as any)
          .returning();

        if (!adminRole) {
          throw new BadRequestException('Failed to create Admin role');
        }

        const [userRole] = await tx
          .insert(user_roles)
          .values({
            userId: user.id,
            roleId: adminRole.id,
            organizationId: organizationId!,
          } as any)
          .returning();

        if (!userRole) {
          throw new BadRequestException(
            'Failed to assign Admin role to user',
          );
        }

        return {
          user,
          role: adminRole,
          userRole,
        };
      }

      if (roleIds && roleIds.length > 0) {
        const createdUserRoles: any[] = [];
        for (const roleId of roleIds) {
          const [userRole] = await tx
            .insert(user_roles)
            .values({
              userId: user.id,
              roleId,
              organizationId: organizationId!,
            } as any)
            .returning();

          if (!userRole) {
            throw new BadRequestException(
              `Failed to assign role ${roleId} to user`,
            );
          }
          createdUserRoles.push(userRole);
        }

        return {
          user,
          userRoles: createdUserRoles,
        };
      }

      return { user };
    });
  }

  async create(payload: CreateUserDto) {
    const hasId = !!payload.organizationId;
    const hasName = !!payload.organizationName?.trim();
    if (hasId && hasName) {
      throw new BadRequestException('Provide only one of organizationId or organizationName');
    }
    if (!hasId && !hasName) {
      throw new BadRequestException('Either organizationId or organizationName is required');
    }
    let organizationId = payload.organizationId;
    let isFirstUser = false;
    if (hasName) {
      const org = await this.organizationsService.getOrCreateByName(
        payload.organizationName!.trim(),
      );
      organizationId = org.id;
    }
    if (organizationId) {
      const userCount = await this.usersRepository.countUsersInOrganization(organizationId);
      isFirstUser = userCount === 0;
    }
    const hashedPassword = await this.bcrypt.hashPassword(payload.password);
    const { organizationName: _, roleIds, ...rest } = payload;
    const user = await this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      organizationId: organizationId!,
      isOrganizationOwner: isFirstUser,
    });
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }
    if (roleIds && roleIds.length > 0) {
      for (const roleId of roleIds) {
        await this.userRolesService.create({
          userId: user.id,
          roleId,
        });
      }
    }
    return user;
  }

  async createOrganizationUser(organizationId: string, payload: CreateOrganizationUserDto) {
    const userCount = await this.usersRepository.countUsersInOrganization(organizationId);
    const isFirstUser = userCount === 0;
    const hashedPassword = await this.bcrypt.hashPassword(payload.password);
    const { roleIds, ...userData } = payload;
    const user = await this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      organizationId,
      isOrganizationOwner: isFirstUser,
    });
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }
    for (const roleId of roleIds) {
      await this.userRolesService.create({
        userId: user.id,
        roleId,
      });
    }
    return user;
  }

  async update(
    id: string,
    payload: UpdateUserDto,
  ): Promise<typeof schema.users.$inferSelect | null> {
    const updatePayload = { ...payload };
    if (updatePayload.password) {
      updatePayload.password = await this.bcrypt.hashPassword(updatePayload.password);
    }
    return this.usersRepository.update(id, updatePayload) as Promise<
      typeof schema.users.$inferSelect | null
    >;
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findByEmailOrUsername(dto.loginIdentifier.trim());
    if (!user) {
      throw new UnauthorizedException('Invalid email/username or password');
    }
    const valid = await this.bcrypt.comparePassword(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email/username or password');
    }

    const accessToken = this.jwtTokenService.loginToken({ id: user.id });
    const refreshToken = this.jwtTokenService.generateRefreshToken(user.id);

    await this.usersRepository.update(user.id, {
      id: user.id,
      refreshToken,
      lastLoginAt: new Date(),
    } as UpdateUserDto);

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;
    return {
      user: userWithoutSensitiveData,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    const payload = await this.jwtTokenService.verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersRepository.findByRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtTokenService.loginToken({ id: user.id });
    const newRefreshToken = this.jwtTokenService.generateRefreshToken(user.id);

    await this.usersRepository.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    await this.usersRepository.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
