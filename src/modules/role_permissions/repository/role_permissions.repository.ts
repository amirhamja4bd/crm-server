import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateRole_permissionDto, UpdateRole_permissionDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class Role_permissionsRepository extends BaseRepository<
  typeof schema,
  typeof schema.role_permissions.$inferSelect,
  CreateRole_permissionDto,
  UpdateRole_permissionDto
> {
  constructor() {
    super(schema, schema.role_permissions, [], []);
  }
}
