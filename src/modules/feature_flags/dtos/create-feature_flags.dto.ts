import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFeature_flagDto {
  @ApiProperty({ example: 'sso', description: 'Feature flag name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({
    example: 'Single sign-on',
    description: 'Feature description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether feature is enabled' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
