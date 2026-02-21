import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  @MaxLength(100)
  username!: string;

  @ApiProperty({ example: '+1234567890', description: 'Mobile number' })
  @IsString()
  @MaxLength(50)
  mobile!: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsString()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  @IsString()
  @MaxLength(255)
  password!: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Organization UUID (provide organizationId OR organizationName)',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({
    example: 'Acme Inc',
    description: 'Organization name (use if org does not exist; creates org with trial plan)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizationName?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({ example: false, description: 'Is organization owner' })
  @IsOptional()
  @IsBoolean()
  isOrganizationOwner?: boolean;

  @ApiPropertyOptional({
    example: 'pending',
    description: 'User status',
    enum: ['active', 'inactive', 'pending', 'blocked'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: false, description: 'Is verified' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: ['uuid1', 'uuid2'],
    description: 'Array of role IDs to assign to user (optional)',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds?: string[];
}
