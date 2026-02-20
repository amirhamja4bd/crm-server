import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class RolesRepository extends BaseRepository<
  typeof schema,
  typeof schema.roles.$inferSelect,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor() {
    super(schema, schema.roles, [], []);
  }
}
