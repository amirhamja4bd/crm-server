import { SQL, SQLWrapper } from 'drizzle-orm';
import { DrizzleDB } from './drizzle';

export interface IApiResponse<T> {
  status: boolean;
  path: string;
  error?: unknown;
  statusCode: number;
  message: string;
  data: T | null;
}

export interface IBaseEntity {
  id?: number | string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WithRelations {
  with?: Record<
    string,
    | boolean
    | WithRelations
    | {
        columns?: Record<string, boolean>;
        where?: (row: unknown, operators: unknown) => SQLWrapper;
      }
  >;
}

// Helper interface for validation errors
export interface ValidationError {
  field: string;
  message: string;
  expected: number;
  received: number;
}

// Helper interface for sales mushak 6.3 wrapper

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
}

export interface PaginationResult<T> {
  data: T[] | T;
  meta: {
    total: number;
    page: number;
    limit: number;
    skip: number;
    totalPages: number;
    nextPage?: number;
    prevPage?: number;
  };
}

export interface ValidatedPaginationOptions {
  page: number;
  limit: number;
  offset: number;
  nextPage?: number;
  previousPage?: number;
  search?: string;
  searchFields: string[];
  sortField: string;
  sortOrder: string;
  filters?: Record<string, any>;
}

export interface QueryContext {
  db: DrizzleDB;
  table: any;
  options: ValidatedPaginationOptions;
  conditions: SQL<unknown>;
  relations?: WithRelations;
  queryTableName?: string;
  selectFields?: string[];
}
