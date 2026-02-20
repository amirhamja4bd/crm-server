import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import { PermissionsRepository } from '../repository/permissions.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class PermissionsService extends BaseService<
  typeof schema,
  typeof schema.permissions.$inferSelect,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor(private readonly permissionsRepository: PermissionsRepository) {
    super(permissionsRepository);
  }
}
