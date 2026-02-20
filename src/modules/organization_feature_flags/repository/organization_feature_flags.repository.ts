import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateOrganization_feature_flagDto, UpdateOrganization_feature_flagDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class Organization_feature_flagsRepository extends BaseRepository<
  typeof schema,
  typeof schema.organization_feature_flags.$inferSelect,
  CreateOrganization_feature_flagDto,
  UpdateOrganization_feature_flagDto
> {
  constructor() {
    super(schema, schema.organization_feature_flags, [], []);
  }
}
