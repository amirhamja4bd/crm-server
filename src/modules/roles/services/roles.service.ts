import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from '../dtos';
import { RolesRepository } from '../repository/roles.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class RolesService extends BaseService<
  typeof schema,
  typeof schema.roles.$inferSelect,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(private readonly rolesRepository: RolesRepository) {
    super(rolesRepository);
  }
}
