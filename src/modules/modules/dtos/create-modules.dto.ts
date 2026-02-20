import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'CRM', description: 'Module name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'Customer relationship', description: '' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'crm-icon', description: 'Icon name or URL' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  icon?: string;
}
