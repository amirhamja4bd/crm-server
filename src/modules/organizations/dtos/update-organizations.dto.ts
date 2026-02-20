import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateOrganizationDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'Acme Inc', description: 'Organization name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'contact@acme.com', description: 'Email' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: 'acme-inc', description: 'Slug' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({ example: 'acme.com', description: 'Domain' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  domain?: string;

  @ApiPropertyOptional({ example: 'https://logo.url', description: 'Logo URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @ApiPropertyOptional({ example: 'https://acme.com', description: 'Website' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;

  @ApiPropertyOptional({ example: false, description: 'Is public' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is verified' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Is trial' })
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @ApiPropertyOptional({ example: 'America/New_York', description: 'Timezone' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @ApiPropertyOptional({ example: 'USD', description: 'Currency' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Subscription plan id' })
  @IsOptional()
  @IsUUID()
  subscriptionPlanId?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Subscription plan status',
    enum: ['trial', 'active', 'inactive', 'pending', 'blocked'],
  })
  @IsOptional()
  @IsString()
  subscriptionPlanStatus?: string;

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
