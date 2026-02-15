import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  DEFAULT_SORT_FIELD,
  DEFAULT_SORT_ORDER,
  MAX_LIMIT,
} from '@/constants/constants';
import { and, asc, desc, eq, ilike, or, SQL, sql } from 'drizzle-orm';
import { DrizzleDB } from '../types/drizzle';
import { PaginationOptions, ValidatedPaginationOptions, WithRelations } from '../types/types';

/**
 * Validates and normalizes pagination options
 */
export function validateOptions(options: PaginationOptions): ValidatedPaginationOptions {
  const page = Math.max(DEFAULT_PAGE, Number(options.page || DEFAULT_PAGE));
  const limit = Math.max(1, Math.min(MAX_LIMIT, Number(options.limit || DEFAULT_LIMIT)));

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    search: options.search,
    searchFields: options.searchFields || [],
    sortField: options.sortField || DEFAULT_SORT_FIELD,
    sortOrder: options.sortOrder || DEFAULT_SORT_ORDER,
    filters: options.filters || {},
  };
}

/**
 * Parse comma-separated filters into a record object
 * @param filtersString - Comma-separated filters (e.g., "role:1,status:2")
 * @returns Record of filters
 */
export function parseFilters(filtersString?: string): Record<string, any> {
  if (!filtersString?.trim()) return {};

  const filters: Record<string, any> = {};
  const filterPairs = filtersString.split(',').map((f) => f.trim());

  for (const pair of filterPairs) {
    const [key, value] = pair.split(':').map((s) => s.trim());
    if (key && value !== undefined) {
      // Try to parse as number, otherwise keep as string
      const numValue = Number(value);
      filters[key] = isNaN(numValue) ? value : numValue;
    }
  }

  return filters;
}

/**
 * Parse comma-separated string into array
 * @param str - Comma-separated string
 * @returns Array of strings
 */
export function parseCommaSeparated(str?: string): string[] {
  if (!str?.trim()) return [];
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Builds query conditions including search and filters
 */
export function buildConditions(
  table: any,
  baseCondition?: SQL<unknown>,
  search?: string,
  searchFields: string[] = [],
  filters?: Record<string, any>,
): SQL<unknown> {
  // Start with base condition and isDeleted check
  let conditions: SQL<unknown> = and(
    baseCondition ?? sql`1=1`,
    eq(table.isDeleted, false),
  ) as SQL<unknown>;

  // Add search conditions if search term and fields are provided
  if (search?.trim() && searchFields.length > 0) {
    const searchConditions = searchFields
      .map((field) => (table[field] ? ilike(table[field], `%${search.trim()}%`) : undefined))
      .filter((c): c is SQL<unknown> => typeof c !== 'undefined');

    if (searchConditions.length > 0) {
      conditions = and(conditions, or(...searchConditions)) as SQL<unknown>;
    }
  }

  // Add filter conditions
  if (filters && Object.keys(filters).length > 0) {
    const filterConditions: SQL<unknown>[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (table[key] && value !== undefined && value !== null && value !== '') {
        filterConditions.push(eq(table[key], value));
      }
    }

    if (filterConditions.length > 0) {
      conditions = and(conditions, ...filterConditions) as SQL<unknown>;
    }
  }

  return conditions;
}

/**
 * Creates order by clause
 */
export function buildOrderBy(table: any, field: string, order: 'asc' | 'desc') {
  return table[field] ? (order === 'desc' ? desc(table[field]) : asc(table[field])) : undefined;
}

/**
 * Executes query with relations
 */
export async function queryWithRelations<T>(
  db: DrizzleDB,
  table: any,
  options: ValidatedPaginationOptions,
  conditions: SQL<unknown>,
  relations: WithRelations,
  queryTableName?: string,
  selectFields?: string[],
): Promise<T[]> {
  const queryTable = queryTableName || table.name;

  if (!db.query?.[queryTable]) {
    throw new Error(`Query table "${queryTable}" not found`);
  }

  const columns = selectFields?.length
    ? Object.fromEntries(selectFields.map((f) => [f.replace('-', ''), !f.startsWith('-')]))
    : undefined;

  return await db.query[queryTable].findMany({
    where: conditions,
    with: relations.with || {},
    limit: options.limit,
    offset: options.offset,
    orderBy: buildOrderBy(table, options.sortField, options.sortOrder as 'desc' | 'asc'),
    columns,
  });
}

/**
 * Executes standard query without relations
 */
export async function queryStandard<T>(
  db: DrizzleDB,
  table: any,
  options: ValidatedPaginationOptions,
  conditions: SQL<unknown>,
  selectFields?: string[],
): Promise<T[]> {
  const selectObj = buildSelect(table, selectFields);
  const hasSelect = Object.keys(selectObj).length > 0;

  let query = hasSelect ? db.select(selectObj).from(table) : db.select().from(table);

  query = query.where(conditions) as any;

  const orderBy = buildOrderBy(table, options.sortField, options.sortOrder as 'desc' | 'asc');
  if (orderBy) {
    query = query.orderBy(orderBy) as any;
  }

  return (await query.limit(options.limit).offset(options.offset)) as T[];
}

/**
 * Gets total count for pagination
 */
export async function getCount(
  db: DrizzleDB,
  table: any,
  conditions: SQL<unknown>,
): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(conditions);
  return Number(result[0].count);
}

/**
 * Build select query
 */
export const buildSelectQuery = (db: DrizzleDB, table: any, fields: string[]) => {
  const include = fields.filter((f) => !f.startsWith('-'));
  const exclude = fields.filter((f) => f.startsWith('-')).map((f) => f.slice(1));

  const selected = include.length
    ? include.filter((f) => !exclude.includes(f))
    : exclude.length
      ? Object.keys(table).filter((k) => !exclude.includes(k))
      : null;

  return selected
    ? db.select(Object.fromEntries(selected.map((f) => [f, table[f]]))).from(table)
    : db.select().from(table);
};

/**
 * Creates column selection for query
 */
export function buildSelect(table: any, fields: string[] = []) {
  if (!fields.length) return {};

  const include = fields.filter((f) => !f.startsWith('-'));
  const exclude = fields.filter((f) => f.startsWith('-')).map((f) => f.slice(1));

  const selected = include.length
    ? include.filter((f) => !exclude.includes(f))
    : Object.keys(table).filter((k) => !exclude.includes(k));

  return Object.fromEntries(selected.map((f) => [f, table[f]]));
}
