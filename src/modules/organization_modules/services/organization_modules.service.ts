import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateOrganization_moduleDto, UpdateOrganization_moduleDto } from '../dtos';
import { Organization_modulesRepository } from '../repository/organization_modules.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class Organization_modulesService extends BaseService<
  typeof schema,
  typeof schema.organization_modules.$inferSelect,
  CreateOrganization_moduleDto,
  UpdateOrganization_moduleDto
> {
  constructor(private readonly organization_modulesRepository: Organization_modulesRepository) {
    super(organization_modulesRepository);
  }
}
