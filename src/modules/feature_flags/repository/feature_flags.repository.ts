import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateFeature_flagDto, UpdateFeature_flagDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class Feature_flagsRepository extends BaseRepository<
  typeof schema,
  typeof schema.feature_flags.$inferSelect,
  CreateFeature_flagDto,
  UpdateFeature_flagDto
> {
  constructor() {
    super(schema, schema.feature_flags, [], []);
  }
}
