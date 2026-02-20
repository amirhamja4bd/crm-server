import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateUser_roleDto, UpdateUser_roleDto } from '../dtos';
import { User_rolesRepository } from '../repository/user_roles.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class User_rolesService extends BaseService<
  typeof schema,
  typeof schema.user_roles.$inferSelect,
  CreateUser_roleDto,
  UpdateUser_roleDto
> {
  constructor(private readonly user_rolesRepository: User_rolesRepository) {
    super(user_rolesRepository);
  }
}
