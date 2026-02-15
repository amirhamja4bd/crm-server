import { BaseRepository } from '@/shared/base-classes/base.repository';
import { PaginationDto } from '@/shared/pagination/pagination.dto';
import { IBaseEntity, PaginationResult, WithRelations } from '@/shared/types/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SQLWrapper } from 'drizzle-orm';

@Injectable()
export abstract class BaseService<
  TSchema,
  TEntity extends IBaseEntity,
  TCreateDto,
  TUpdateDto extends IBaseEntity,
> {
  constructor(
    protected readonly repository: BaseRepository<TSchema, TEntity, TCreateDto, TUpdateDto>,
  ) {}

  /**
   * Create a new document in the database
   * @param createDto The data to create the document with
   * @returns The created document
   */
  async create(createDto: TCreateDto) {
    return await this.repository.create(createDto);
  }

  /**
   * Find all documents in the database
   * @param query The query parameters
   * @param relations Optional relations to include
   * @returns An array of documents
   */
  async findAll(
    query: PaginationDto,
    relations?: WithRelations,
    condition?: SQLWrapper,
    selectFields?: string[],
  ): Promise<TEntity[] | PaginationResult<TEntity> | null> {
    return await this.repository.findAll(query, relations, condition, selectFields);
  }

  /**
   * Find a document by its ID
   * @param id The ID of the document to find
   * @param relations Optional relations to include
   * @returns The found document or null if it doesn't exist
   */
  async findById(id: number | string, relations?: WithRelations): Promise<TEntity | null> {
    return await this.repository.findById(id, relations);
  }

  /**
   * Find a document by custom conditions
   * @param condition The condition to filter by
   * @param relations Optional relations to include
   * @returns The found document or null if it doesn't exist
   */
  async findOne(
    condition: SQLWrapper,
    relations?: WithRelations,
    orderBy?: 'asc' | 'desc',
  ): Promise<TEntity | null> {
    return await this.repository.findOne(condition, relations, orderBy);
  }

  /**
   * Update a document by its ID
   * @param id The ID of the document to update
   * @param updateDto The data to update the document with
   * @returns The updated document
   */
  async update(id: number | string, updateDto: TUpdateDto): Promise<TEntity | null> {
    return await this.repository.update(id, updateDto);
  }

  /**
   * Soft delete a document by its ID
   * @param id The ID of the document to delete
   * @returns The deleted document or null if it doesn't exist
   */
  async delete(id: number | string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new BadRequestException('Id not found');
    return;
  }

  /**
   * Hard delete a document by its ID
   * @param id The ID of the document to delete
   * @returns The deleted document or null if it doesn't exist
   */
  async hardDelete(id: number | string): Promise<void> {
    const deleted = await this.repository.hardDelete(id);
    if (!deleted) throw new BadRequestException('Id not found');
    return;
  }
}
