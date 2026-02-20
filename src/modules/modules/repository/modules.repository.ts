import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class ModulesRepository extends BaseRepository<
  typeof schema,
  typeof schema.modules.$inferSelect,
  CreateModuleDto,
  UpdateModuleDto
> {
  constructor() {
    super(schema, schema.modules, [], []);
  }
}
