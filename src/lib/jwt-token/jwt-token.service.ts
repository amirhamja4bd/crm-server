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
  async loginToken(payload: LoginTokenPayload): Promise<string> {
    // get the config
    const secret = await this.configService.get('JWT_SECRET');
    const expiresIn = await this.configService.get('JWT_EXPIRES_IN');
    const algorithm = await this.configService.get('JWT_ALGORITHM');

    // sign the token
    const token = this.jwtService.sign(payload, { secret, expiresIn, algorithm });
    return token;
  }

  /**
   * Verify a login token
   * @param token - The token to verify
   * @returns The payload of the token
   */
  async verifyLoginToken<T extends object>(token: string): Promise<T> {
    try {
      const secret = this.configService.get('JWT_SECRET');
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
  async generateRefreshToken(email: string) {
    const secret = await this.configService.get('REFRESH_SECRET');
    const expiresIn = await this.configService.get('REFRESH_EXPIRES_IN');
    const algorithm = await this.configService.get('JWT_ALGORITHM');

    const payload: RefreshTokenPayload = { email };
    return this.jwtService.sign(payload, { secret, expiresIn, algorithm });
  }

  /**
   * Verify a refresh token
   * @param token - The token to verify
   * @returns The payload of the token
   */
  async verifyRefreshToken(token: string) {
    try {
      const secret = await this.configService.get('REFRESH_SECRET');
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(token, { secret });
      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
