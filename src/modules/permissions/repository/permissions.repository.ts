import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class PermissionsRepository extends BaseRepository<
  typeof schema,
  typeof schema.permissions.$inferSelect,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor() {
    super(schema, schema.permissions, [], []);
  }
}
