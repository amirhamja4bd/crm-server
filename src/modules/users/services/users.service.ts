import { OrganizationsService } from '@/modules/organizations/services/organizations.service';
import { BaseService } from '@/shared/base-classes/base.service';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptService } from 'src/lib/bcrypt/bcrypt.service';
import { JwtTokenService } from 'src/lib/jwt-token/jwt-token.service';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dtos';
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
    private readonly usersRepository: UsersRepository,
    private readonly bcrypt: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly organizationsService: OrganizationsService,
  ) {
    super(usersRepository);
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
    if (hasName) {
      const org = await this.organizationsService.getOrCreateByName(
        payload.organizationName!.trim(),
      );
      organizationId = org.id;
    }
    const hashedPassword = await this.bcrypt.hashPassword(payload.password);
    const { organizationName: _, ...rest } = payload;
    return await this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      organizationId: organizationId!,
    });
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
