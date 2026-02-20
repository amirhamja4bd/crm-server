import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSubscription_planDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'Pro Plan', description: 'Plan name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Best for teams', description: 'Description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 29.99, description: 'Price' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Currency' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: 'monthly', description: 'Billing cycle' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  billingCycle?: string;

  @ApiPropertyOptional({ example: 10, description: 'Max users' })
  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @ApiPropertyOptional({ example: 14, description: 'Trial period days' })
  @IsOptional()
  @IsNumber()
  trialPeriodDays?: number;

  @ApiPropertyOptional({ description: 'Features (JSON array)' })
  @IsOptional()
  @IsArray()
  features?: unknown[];

  @ApiPropertyOptional({ example: true, description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0, description: 'Sort order' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: false, description: 'Soft delete flag' })
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  @IsOptional()
  updatedAt?: Date;
}
