import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganization_feature_flagDto {
  @ApiProperty({ example: 'uuid', description: 'Feature flag id' })
  featureId!: string;

  @ApiProperty({ example: 'uuid', description: 'Organization id' })
  organizationId!: string;

  @ApiProperty({ example: true, description: 'Whether enabled for org' })
  enabled!: boolean;
}
