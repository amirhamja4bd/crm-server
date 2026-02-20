import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateRole_permissionDto, UpdateRole_permissionDto } from '../dtos';
import { Role_permissionsRepository } from '../repository/role_permissions.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class Role_permissionsService extends BaseService<
  typeof schema,
  typeof schema.role_permissions.$inferSelect,
  CreateRole_permissionDto,
  UpdateRole_permissionDto
> {
  constructor(private readonly role_permissionsRepository: Role_permissionsRepository) {
    super(role_permissionsRepository);
  }
}
