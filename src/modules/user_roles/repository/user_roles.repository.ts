import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateUser_roleDto, UpdateUser_roleDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class User_rolesRepository extends BaseRepository<
  typeof schema,
  typeof schema.user_roles.$inferSelect,
  CreateUser_roleDto,
  UpdateUser_roleDto
> {
  constructor() {
    super(schema, schema.user_roles, [], []);
  }
}
