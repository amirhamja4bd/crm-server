import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from './bcrypt/bcrypt.service';
import { JwtTokenService } from './jwt-token/jwt-token.service';

@Global()
@Module({
  imports: [JwtModule, ConfigModule],
  providers: [BcryptService, JwtTokenService],
  exports: [BcryptService, JwtTokenService],
})
export class LibModule {}
