import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique user identifier' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'johndoe', description: 'Username' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  username?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Mobile' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mobile?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: 'strongpassword', description: 'Password' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  password?: string;

  @ApiPropertyOptional({ example: 'https://avatar.url', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'User status',
    enum: ['active', 'inactive', 'pending', 'blocked'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: true, description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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
