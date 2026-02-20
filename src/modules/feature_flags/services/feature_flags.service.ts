import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateFeature_flagDto, UpdateFeature_flagDto } from '../dtos';
import { Feature_flagsRepository } from '../repository/feature_flags.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class Feature_flagsService extends BaseService<
  typeof schema,
  typeof schema.feature_flags.$inferSelect,
  CreateFeature_flagDto,
  UpdateFeature_flagDto
> {
  constructor(private readonly feature_flagsRepository: Feature_flagsRepository) {
    super(feature_flagsRepository);
  }
}
