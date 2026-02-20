import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from '../dtos';
import { ModulesRepository } from '../repository/modules.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class ModulesService extends BaseService<
  typeof schema,
  typeof schema.modules.$inferSelect,
  CreateModuleDto,
  UpdateModuleDto
> {
  constructor(private readonly modulesRepository: ModulesRepository) {
    super(modulesRepository);
  }
}
