import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { CreateOrganizationDto, UpdateOrganizationDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class OrganizationsRepository extends BaseRepository<
  typeof schema,
  typeof schema.organizations.$inferSelect,
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor() {
    super(schema, schema.organizations, ['name', 'email'], ['email', 'phone', 'slug', 'domain']);
  }

  async findByName(name: string) {
    const table = schema.organizations;
    return await this.db
      .select()
      .from(table)
      .where(and(eq(table.name, name), eq(table.isDeleted, false)))
      .limit(1)
      .then((rows) => rows[0] ?? null);
  }
}
