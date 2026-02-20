import { ApiProperty } from '@nestjs/swagger';

export class Feature_flagResponseDto {
  @ApiProperty({ example: 'uuid-or-id', description: 'Id' })
  id!: string;

  @ApiProperty({ example: 'sso', description: 'Feature flag name' })
  name!: string;

  @ApiProperty({ example: 'Single sign-on', description: 'Description' })
  description!: string;

  @ApiProperty({ example: true, description: 'Whether enabled' })
  enabled!: boolean;
}
