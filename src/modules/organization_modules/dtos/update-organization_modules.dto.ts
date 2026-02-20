import { ApiPropertyOptional } from '@nestjs/swagger';
import { IBaseEntity } from '@/shared/types/types';

export class UpdateOrganization_moduleDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  id?: string;

  @ApiPropertyOptional({ example: false, description: 'Soft delete flag' })
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
