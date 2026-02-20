import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateOrganization_moduleDto {
  @ApiProperty({ example: 'uuid', description: 'Module id' })
  @IsUUID()
  moduleId!: string;

  @ApiProperty({ example: 'uuid', description: 'Organization id' })
  @IsUUID()
  organizationId!: string;
}
