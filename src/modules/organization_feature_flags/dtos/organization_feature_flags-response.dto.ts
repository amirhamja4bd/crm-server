import { ApiProperty } from '@nestjs/swagger';

export class Organization_feature_flagResponseDto {
  @ApiProperty({ example: 'uuid-or-id', description: 'Id' })
  id!: string;

  @ApiProperty({ example: 'uuid', description: 'Feature flag id' })
  featureId!: string;

  @ApiProperty({ example: 'uuid', description: 'Organization id' })
  organizationId!: string;

  @ApiProperty({ example: true, description: 'Whether enabled' })
  enabled!: boolean;
}
