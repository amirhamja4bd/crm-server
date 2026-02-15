import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
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
    super(schema, schema.users, ['email', 'name'], ['email']);
  }
}
