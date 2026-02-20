import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Inc', description: 'Organization name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'contact@acme.com', description: 'Organization email' })
  @IsString()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: '+1234567890', description: 'Organization phone' })
  @IsString()
  @MaxLength(50)
  phone!: string;

  @ApiProperty({ example: 'acme-inc', description: 'URL slug' })
  @IsString()
  @MaxLength(255)
  slug!: string;

  @ApiProperty({ example: 'acme.com', description: 'Domain' })
  @IsString()
  @MaxLength(255)
  domain!: string;

  @ApiPropertyOptional({ example: 'https://logo.url', description: 'Logo URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logo?: string;

  @ApiPropertyOptional({ example: 'https://acme.com', description: 'Website URL' })
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

  @ApiPropertyOptional({ example: 'USD', description: 'Currency code' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiProperty({ example: 'uuid', description: 'Subscription plan id' })
  @IsUUID()
  subscriptionPlanId!: string;

  @ApiPropertyOptional({
    example: 'trial',
    description: 'Subscription plan status',
    enum: ['trial', 'active', 'inactive', 'pending', 'blocked'],
  })
  @IsOptional()
  @IsString()
  subscriptionPlanStatus?: string;
}
