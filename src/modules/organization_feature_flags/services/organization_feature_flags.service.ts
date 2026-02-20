import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateOrganization_feature_flagDto, UpdateOrganization_feature_flagDto } from '../dtos';
import { Organization_feature_flagsRepository } from '../repository/organization_feature_flags.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class Organization_feature_flagsService extends BaseService<
  typeof schema,
  typeof schema.organization_feature_flags.$inferSelect,
  CreateOrganization_feature_flagDto,
  UpdateOrganization_feature_flagDto
> {
  constructor(private readonly organization_feature_flagsRepository: Organization_feature_flagsRepository) {
    super(organization_feature_flagsRepository);
  }
}
