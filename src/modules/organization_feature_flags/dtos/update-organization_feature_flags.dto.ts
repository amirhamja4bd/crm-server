import { IBaseEntity } from '@/shared/types/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganization_feature_flagDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique identifier' })
  id?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Feature flag id' })
  featureId?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Organization id' })
  organizationId?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether enabled' })
  enabled?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Soft delete flag' })
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
