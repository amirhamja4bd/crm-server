import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { CreateSubscription_planDto, UpdateSubscription_planDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class Subscription_plansRepository extends BaseRepository<
  typeof schema,
  typeof schema.subscription_plans.$inferSelect,
  CreateSubscription_planDto,
  UpdateSubscription_planDto
> {
  constructor() {
    super(schema, schema.subscription_plans, [], []);
  }
}
