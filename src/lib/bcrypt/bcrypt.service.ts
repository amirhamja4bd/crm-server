import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  /**
   * Hash a password
   * @param password - The password to hash
   * @returns The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare a password with a hash
   * @param password - The password to compare
   * @param hash - The hash to compare against
   * @returns True if the password matches the hash, false otherwise
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
