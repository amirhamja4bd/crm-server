import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name' })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: false, description: 'Is super admin role' })
  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;
}
