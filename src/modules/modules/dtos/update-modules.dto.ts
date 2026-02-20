import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateModuleDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'CRM', description: 'Module name' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Customer relationship', description: '' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'crm-icon', description: 'Icon' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;

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
