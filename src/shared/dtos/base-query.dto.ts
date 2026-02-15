import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ValidatedPaginationOptions } from '../types/types';

export class BaseQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  searchFields?: string[];

  /**
   * Normalize and return validated pagination options with defaults
   */
  toValidatedOptions(): ValidatedPaginationOptions {
    const pageNum = Number(this.page ?? 0);
    const limitNum = Number(this.limit ?? 0);
    const page = pageNum && pageNum > 0 ? Math.floor(pageNum) : 1;
    const limit = limitNum && limitNum > 0 ? Math.floor(limitNum) : 10;
    const offset = (page - 1) * limit;
    const searchFields =
      this.searchFields && this.searchFields.length ? this.searchFields : ['email', 'name'];
    const sortField = this.sortField ?? 'createdAt';
    const sortOrder = this.sortOrder ?? 'desc';
    return {
      page,
      limit,
      offset,
      nextPage: undefined,
      previousPage: undefined,
      search: this.search,
      searchFields,
      sortField,
      sortOrder,
    } as ValidatedPaginationOptions;
  }
}

export default BaseQueryDto;
