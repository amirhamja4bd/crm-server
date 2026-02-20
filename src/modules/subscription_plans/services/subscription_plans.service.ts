import { BaseService } from '@/shared/base-classes/base.service';
import { Injectable } from '@nestjs/common';
import { CreateSubscription_planDto, UpdateSubscription_planDto } from '../dtos';
import { Subscription_plansRepository } from '../repository/subscription_plans.repository';
import * as schema from '../schemas/schema';

@Injectable()
export class Subscription_plansService extends BaseService<
  typeof schema,
  typeof schema.subscription_plans.$inferSelect,
  CreateSubscription_planDto,
  UpdateSubscription_planDto
> {
  constructor(private readonly subscription_plansRepository: Subscription_plansRepository) {
    super(subscription_plansRepository);
  }
}
