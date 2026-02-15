import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { BcryptService } from 'src/lib/bcrypt/bcrypt.service';
import { CreateUserDto, UpdateUserDto } from '../dtos';
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
  ) {
    super(usersRepository);
  }
}
