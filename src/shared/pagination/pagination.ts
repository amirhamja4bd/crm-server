import { SQL } from 'drizzle-orm';
import { DrizzleDB } from '../types/drizzle';
import { PaginationOptions, PaginationResult, WithRelations } from '../types/types';
import {
  buildConditions,
  getCount,
  parseCommaSeparated,
  queryStandard,
  queryWithRelations,
  validateOptions,
} from './builder-condition';

/**
 * A utility function to paginate and filter database queries with optional relation support
 *
 * @param db - Drizzle database instance
 * @param table - Drizzle table object
 * @param options - Pagination, sorting and filtering options
 * @param baseCondition - Optional base condition to filter results
 * @param relations - Optional related tables to include in the query
 * @param queryTableName - Optional table name for relations query
 * @param selectFields - Optional fields to select/exclude (comma-separated string or array)
 * @returns A promise resolving to paginated data with metadata
 */
export async function paginateQuery<T extends Record<string, any>>(
  db: DrizzleDB,
  table: any,
  options: PaginationOptions = {},
  baseCondition?: SQL<unknown>,
  relations?: WithRelations,
  queryTableName?: string,
  selectFields?: string[] | string,
): Promise<PaginationResult<T>> {
  try {
    // Parse select fields if it's a comma-separated string
    const parsedSelectFields =
      typeof selectFields === 'string' ? parseCommaSeparated(selectFields) : selectFields || [];

    const opts = validateOptions(options);
    const conditions = buildConditions(
      table,
      baseCondition,
      opts.search,
      opts.searchFields,
      opts.filters,
    );
    const total = await getCount(db, table, conditions);

    const data =
      relations && Object.keys(relations.with || {}).length > 0
        ? await queryWithRelations(
            db,
            table,
            opts,
            conditions,
            relations,
            queryTableName,
            parsedSelectFields,
          )
        : await queryStandard(db, table, opts, conditions, parsedSelectFields);

    const totalPages = Math.ceil(total / opts.limit);

    return {
      data: data as T[],
      meta: {
        total,
        page: opts.page,
        limit: opts.limit,
        skip: opts.offset,
        totalPages,
        nextPage: opts.page < totalPages ? opts.page + 1 : undefined,
        prevPage: opts.page > 1 ? opts.page - 1 : undefined,
      },
    };
  } catch (error) {
    console.error('Pagination error:', error);
    throw error;
  }
}
