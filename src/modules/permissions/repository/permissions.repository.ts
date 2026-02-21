import { BaseRepository } from '@/shared/base-classes/base.repository';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { PREDEFINED_PERMISSIONS } from '../constants/permissions.enum';
import { CreatePermissionDto, UpdatePermissionDto } from '../dtos';
import * as schema from '../schemas/schema';

@Injectable()
export class PermissionsRepository extends BaseRepository<
  typeof schema,
  typeof schema.permissions.$inferSelect,
  CreatePermissionDto,
  UpdatePermissionDto
> {
  constructor() {
    super(schema, schema.permissions, [], []);
  }

  async findByResource(resource: string) {
    const table = schema.permissions;
    return await this.db
      .select()
      .from(table)
      .where(and(eq(table.resource, resource), eq(table.isDeleted, false)));
  }

  async findAllGroupedByResource(): Promise<
    Record<string, (typeof schema.permissions.$inferSelect)[]>
  > {
    const table = schema.permissions;
    const rows = await this.db.select().from(table).where(eq(table.isDeleted, false));
    return rows.reduce<Record<string, (typeof schema.permissions.$inferSelect)[]>>((acc, row) => {
      const key = row.resource;
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});
  }

  async seedFromEnum() {
    const table = schema.permissions;
    const toInsert = PREDEFINED_PERMISSIONS.map(({ resource, action }) => ({
      resource,
      action,
    }));
    return await this.db.insert(table).values(toInsert).onConflictDoNothing().returning();
  }
}
