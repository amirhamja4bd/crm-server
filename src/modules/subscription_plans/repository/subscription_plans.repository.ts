import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { and, eq, ilike } from 'drizzle-orm';
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

  async findByName(name: string) {
    const table = schema.subscription_plans;
    return await this.db
      .select()
      .from(table)
      .where(and(eq(table.isDeleted, false), ilike(table.name, name)))
      .limit(1)
      .then((rows) => rows[0] ?? null);
  }
}
