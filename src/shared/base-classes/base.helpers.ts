import { and, eq, inArray, ne, or, SQL } from 'drizzle-orm';
import { DrizzleDB } from '../types/drizzle';
import { BadRequestException } from '@nestjs/common';
import { IBaseEntity, WithRelations } from '../types/types';

/**
 * Check if records with the given unique fields already exist
 * @param data The data to check uniqueness against (single record or array of records)
 * @param uniqueFields Array of field names to check for uniqueness
 * @returns For single record: false if no duplicates, throws exception if duplicate found
 * @returns For bulk: Array of existing records if duplicates are found, empty array otherwise
 * @throws BadRequestException if a duplicate record is found
 */
export async function checkUniqueFields(
  db: DrizzleDB,
  table: any,
  data: Partial<IBaseEntity> | Partial<IBaseEntity>[],
  uniqueFields: string[],
  excludeId?: string | number,
): Promise<boolean | IBaseEntity[]> {
  const isArray = Array.isArray(data);
  const dataArray = isArray ? data : [data];

  if (!uniqueFields?.length || !dataArray.length) {
    return isArray ? [] : false;
  }

  const nonNull = (v: unknown) => v !== undefined && v !== null;

  const collectFieldValues = (fields: string[], rows: Partial<IBaseEntity>[]) =>
    fields
      .map((field) => {
        const vals = rows.map((r) => r[field]).filter(nonNull);
        return vals.length ? inArray(table[field], vals) : null;
      })
      .filter(Boolean) as any[];

  const fieldConditions = collectFieldValues(uniqueFields, dataArray);
  if (!fieldConditions.length) {
    return isArray ? [] : false;
  }

  const buildBaseCondition = () => {
    let condition = and(or(...fieldConditions), eq(table.isDeleted, false));
    if (excludeId !== undefined && excludeId !== null) {
      condition = and(condition, ne(table.id, excludeId));
    }
    return condition;
  };

  const existingRecords = await db.select().from(table).where(buildBaseCondition());

  if (!isArray && existingRecords.length > 0) {
    const singleData = data as IBaseEntity;
    const conflicting = existingRecords[0];
    const conflictingFields = uniqueFields.filter(
      (field) => conflicting[field] === singleData[field],
    );
    throw new BadRequestException(
      `Record with these values already exists: ${conflictingFields.join(', ')}`,
    );
  }

  if (isArray && existingRecords.length > 0) {
    throw new BadRequestException('Duplicate records found');
  }

  return isArray ? [] : false;
}

/**
 * Helper method to add custom conditions
 * @param condition The condition to add
 * @param schema The schema to use
 * @param table The table to use
 * @param relations Optional relations to include
 * @returns Query results with the condition
 */
export async function where(
  db: DrizzleDB,
  schema: any,
  table: any,
  condition: SQL<unknown>,
  relations?: WithRelations,
) {
  const baseCondition = and(condition, eq(table.isDeleted, false));

  if (relations && db.query && schema) {
    return db.query[getQueryTableName(schema)].findMany({
      where: baseCondition,
      with: relations.with || {},
    });
  }

  return db.select().from(table).where(baseCondition);
}

/**
 * Get the query table name for query builder
 * This helper converts schema object to the appropriate string key for db.query
 */
export function getQueryTableName(schema: any): string {
  return Object.keys(schema)[0] || 'table';
}
