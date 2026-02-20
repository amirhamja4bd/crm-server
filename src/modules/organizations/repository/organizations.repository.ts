import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class OrganizationsRepository extends BaseRepository<
  typeof schema,
  typeof schema.organizations.$inferSelect,
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor() {
    super(schema, schema.organizations, [], []);
  }
}
