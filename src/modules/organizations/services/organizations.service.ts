import { Subscription_plansService } from '@/modules/subscription_plans/services/subscription_plans.service';
import { BaseService } from '@/shared/base-classes/base.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos';
import { OrganizationsRepository } from '../repository/organizations.repository';
import * as schema from '../schemas/schema';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

@Injectable()
export class OrganizationsService extends BaseService<
  typeof schema,
  typeof schema.organizations.$inferSelect,
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly subscription_plansService: Subscription_plansService,
  ) {
    super(organizationsRepository);
  }

  async findByName(name: string) {
    return await this.organizationsRepository.findByName(name);
  }

  async getOrCreateByName(organizationName: string) {
    const existing = await this.findByName(organizationName);
    if (existing) return existing;
    const subscriptionPlanId = await this.subscription_plansService.getOrCreateTrialPlan();
    const baseSlug = slugify(organizationName) || 'org';
    const suffix = randomBytes(4).toString('hex');
    const slug = `${baseSlug}-${suffix}`;
    const createDto: CreateOrganizationDto = {
      name: organizationName,
      email: `${slug}@org.trial`,
      phone: `+1${randomBytes(5).toString('hex')}`,
      slug,
      domain: `${slug}.trial`,
      subscriptionPlanId,
      subscriptionPlanStatus: 'trial',
    };
    const created = await this.create(createDto);
    if (!created) throw new BadRequestException('Failed to create organization');
    return created;
  }
}
