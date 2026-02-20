import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateOrganization_moduleDto, UpdateOrganization_moduleDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class Organization_modulesRepository extends BaseRepository<
  typeof schema,
  typeof schema.organization_modules.$inferSelect,
  CreateOrganization_moduleDto,
  UpdateOrganization_moduleDto
> {
  constructor() {
    super(schema, schema.organization_modules, [], []);
  }
}
