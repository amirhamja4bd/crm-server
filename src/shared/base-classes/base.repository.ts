import { DATABASE_CONNECTION } from '@/database/database-connection';
import { BadRequestException, Inject } from '@nestjs/common';
import { SQLWrapper, and, asc, desc, eq } from 'drizzle-orm';

import { IBaseEntity, PaginationResult, WithRelations } from '@/shared/types/types';
import { checkPaginationParams } from '@/utils/utils';
import {
  buildSelectQuery,
  parseCommaSeparated,
  parseFilters,
} from '../pagination/builder-condition';
import { paginateQuery } from '../pagination/pagination';
import { PaginationDto } from '../pagination/pagination.dto';
import type { DrizzleDB } from '../types/drizzle';
import { checkUniqueFields, getQueryTableName } from './base.helpers';

export abstract class BaseRepository<
  TSchema,
  TEntity extends IBaseEntity,
  TCreateDto,
  TUpdateDto extends IBaseEntity,
> {
  @Inject(DATABASE_CONNECTION)
  protected readonly db: DrizzleDB;

  constructor(
    protected readonly schema: TSchema,
    protected readonly table: any,
    protected readonly searchFields: string[] = [],
    protected readonly uniqueFields: string[] = [],
    protected readonly selectFields: string[] = [],
  ) {}

  /**
   * Create a new document in the database
   * @param createDto The data to create the document with
   * @returns The created document
   */
  async create(createDto: TCreateDto) {
    // Check for uniqueness if uniqueFields are provided
    await checkUniqueFields(this.db, this.table, createDto as Partial<TEntity>, this.uniqueFields);

    return await this.db
      .insert(this.table)
      .values(createDto as any)
      .returning()
      .then((res) => res[0]);
  }

  /**
   * Bulk create documents in the database
   * @param createDto The data to create the documents with
   * @returns The created documents
   */
  async bulkCreate(createDto: TCreateDto[]) {
    // check for duplicates
    await checkUniqueFields(
      this.db,
      this.table,
      createDto as unknown as Partial<TEntity>[],
      this.uniqueFields,
    );

    // perform the bulk insert with conflict handling
    return await this.db
      .insert(this.table)
      .values(createDto as any)
      .onConflictDoNothing();
  }

  /**
   * Find all documents in the database with optional relations
   * @param query The query parameters
   * @param relations Optional relations to include
   * @returns An array of documents with relations if specified
   */
  async findAll(
    query: PaginationDto,
    relations?: WithRelations,
    condition?: SQLWrapper,
    selectFields?: string[],
  ): Promise<TEntity[] | PaginationResult<TEntity> | null> {
    const hasPaginationParam = checkPaginationParams(query);
    const baseCondition = eq(this.table.isDeleted, false);
    const combinedCondition = condition ? and(baseCondition, condition) : baseCondition;
    const canUseRelations = !!(relations && this.db.query && this.schema);

    // Parse query parameters
    const parsedSearchFields = query.searchFields
      ? parseCommaSeparated(query.searchFields)
      : this.searchFields;
    const parsedSelectFields = query.select
      ? parseCommaSeparated(query.select)
      : selectFields || [];
    const parsedFilters = parseFilters(query.filters);

    const columns =
      parsedSelectFields && parsedSelectFields.length > 0
        ? Object.fromEntries(
            parsedSelectFields.map((field) => [
              field.startsWith('-') ? field.replace('-', '') : field,
              field.startsWith('-') ? false : true,
            ]),
          )
        : undefined;

    if (!hasPaginationParam) {
      if (canUseRelations) {
        return (await this.db.query[getQueryTableName(this.schema)].findMany({
          where: combinedCondition,
          with: relations?.with || {},
          columns,
        })) as TEntity[];
      }

      const selectColumns = buildSelectQuery(this.db, this.table, parsedSelectFields || []);
      return (await selectColumns.where(combinedCondition)) as TEntity[];
    }

    return paginateQuery(
      this.db,
      this.table,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
        searchFields: parsedSearchFields,
        sortOrder: query.sortOrder,
        sortField: query.sortField,
        filters: parsedFilters,
      },
      combinedCondition,
      canUseRelations ? relations : undefined,
      canUseRelations ? getQueryTableName(this.schema) : undefined,
      parsedSelectFields,
    );
  }

  /**
   * Find a document by its ID with optional relations
   * @param id The ID of the document to find
   * @param relations Optional relations to include
   * @returns The found document or null if it doesn't exist
   */
  async findById(id: number | string, relations?: WithRelations) {
    const baseCondition = and(eq(this.table.id, id), eq(this.table.isDeleted, false));

    if (relations && this.db.query && this.schema) {
      // Use query builder with relations if provided
      return await this.db.query[getQueryTableName(this.schema)].findFirst({
        where: baseCondition,
        with: relations.with || {},
      });
    }

    // Fallback to regular select without relations
    return await this.db
      .select()
      .from(this.table)
      .where(baseCondition)
      .limit(1)
      .then((results) => results[0] || null);
  }

  /**
   * Find a document by custom condition with optional relations
   * @param condition The condition to filter by
   * @param relations Optional relations to include
   * @returns The found document or null if it doesn't exist
   */
  async findOne(condition: SQLWrapper, relations?: WithRelations, orderBy?: 'asc' | 'desc') {
    const baseCondition = and(condition, eq(this.table.isDeleted, false));

    if (relations && this.db.query && this.schema) {
      // Use query builder with relations if provided
      return await this.db.query[getQueryTableName(this.schema)].findFirst({
        where: baseCondition,
        with: relations.with || {},
        orderBy:
          orderBy && orderBy === 'asc' ? asc(this.table.createdAt) : desc(this.table.createdAt),
      });
    }

    // Fallback to regular select without relations
    return await this.db
      .select()
      .from(this.table)
      .where(baseCondition)
      .orderBy(
        orderBy && orderBy === 'asc' ? asc(this.table.createdAt) : desc(this.table.createdAt),
      )
      .limit(1)
      .then((results) => results[0] || null);
  }

  /**
   * Update a document by its ID
   * @param id The ID of the document to update
   * @param updateDto The data to update the document with
   * @returns The updated document
   */
  async update(id: number | string, updateDto: TUpdateDto) {
    if (id !== updateDto?.id) {
      throw new BadRequestException('Id mismatch between path and body');
    }

    // check for duplicates
    await checkUniqueFields(
      this.db,
      this.table,
      updateDto as unknown as Partial<TEntity>[],
      this.uniqueFields,
      id,
    );

    const [updated] = await this.db
      .update(this.table)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(and(eq(this.table.id, id), eq(this.table.isDeleted, false)))
      .returning();

    if (!updated) {
      throw new BadRequestException('Failed to update document');
    }

    return updated;
  }

  /**
   * Soft delete a document by its ID
   * @param id The ID of the document to delete
   * @returns The deleted document or null if it doesn't exist
   */
  async delete(id: number | string) {
    return await this.db
      .update(this.table)
      .set({ isDeleted: true, updatedAt: new Date(), status: false })
      .where(eq(this.table.id, id))
      .returning()
      .then((res) => res[0]);
  }

  /**
   * Hard delete a document by its ID
   * @param id The ID of the document to delete
   * @returns The deleted document or null if it doesn't exist
   */
  async hardDelete(id: number | string) {
    return await this.db.delete(this.table).where(eq(this.table.id, id));
  }
}
