import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvConfig } from '../zod/env.schema';
import { LoginTokenPayload, RefreshTokenPayload } from './types';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {}

  /**
   * Generate a JWT token
   * @param payload - The payload to encode in the token
   * @returns The generated JWT token
   */
  loginToken(payload: LoginTokenPayload): string {
    const secret = this.configService.get('JWT_SECRET', { infer: true });
    const expiresIn = this.configService.get('JWT_EXPIRES_IN', { infer: true });

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = this.jwtService.sign(payload, {
      secret,
      ...(expiresIn && { expiresIn }),
    } as any);
    return token;
  }

  /**
   * Verify a login token
   * @param token - The token to verify
   * @returns The payload of the token
   */
  async verifyLoginToken<T extends object>(token: string): Promise<T> {
    try {
      const secret = this.configService.get('JWT_SECRET', { infer: true });
      const payload = await this.jwtService.verifyAsync<T>(token, { secret });
      return payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Generate a refresh token
   * @param email - The email of the user
   * @returns The generated refresh token
   */
  generateRefreshToken(userId: string): string {
    const secret = this.configService.get('JWT_SECRET', { infer: true });
    const expiresIn = this.configService.get('REFRESH_EXPIRES_IN', { infer: true });

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const payload: RefreshTokenPayload = { id: userId };
    return this.jwtService.sign(payload, {
      secret,
      ...(expiresIn && { expiresIn }),
    } as any);
  }

  /**
   * Verify a refresh token
   * @param token - The token to verify
   * @returns The payload of the token
   */
  async verifyRefreshToken(token: string) {
    try {
      const secret = this.configService.get('JWT_SECRET', { infer: true });
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(token, { secret });
      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
