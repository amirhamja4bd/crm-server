import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'admin', description: 'Role name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

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
