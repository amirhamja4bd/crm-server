import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSubscription_planDto {
  @ApiProperty({ example: 'Pro Plan', description: 'Plan name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'Best for teams', description: 'Description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 29.99, description: 'Price' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Currency code' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    example: 'monthly',
    description: 'Billing cycle',
  })
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

  @ApiPropertyOptional({ description: 'Feature list (JSON array)' })
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
}
