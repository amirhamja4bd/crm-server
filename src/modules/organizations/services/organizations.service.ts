import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos';
import { OrganizationsRepository } from '../repository/organizations.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class OrganizationsService extends BaseService<
  typeof schema,
  typeof schema.organizations.$inferSelect,
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {
    super(organizationsRepository);
  }
}
