import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * @description Pagination dto
 */
export class PaginationDto {
  @ApiProperty({
    description: 'Search query',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Comma-separated search fields (e.g., "name,email")',
    required: false,
    example: 'name,email',
  })
  @IsOptional()
  @IsString()
  searchFields?: string;

  @ApiProperty({
    description: 'Comma-separated select fields (e.g., "name,email,status")',
    required: false,
    example: 'name,email,status',
  })
  @IsOptional()
  @IsString()
  select?: string;

  @ApiProperty({
    description: 'Comma-separated filters (e.g., "role:1,status:2")',
    required: false,
    example: 'role:1,status:2',
  })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    description: 'Limit number',
    example: 10,
    required: false,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    description: 'Sort field',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString()
  sortField?: string;

  @ApiProperty({
    description: 'Sort order (asc or desc)',
    required: false,
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be either asc or desc' })
  sortOrder?: SortOrder;
}

/**
 * @description Omit search from pagination dto
 */
export class PaginationDtoOmitSearch extends OmitType(PaginationDto, ['search'] as const) {}
