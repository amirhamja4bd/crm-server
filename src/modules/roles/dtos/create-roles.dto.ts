import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Role name' })
  @IsString()
  @MaxLength(100)
  name!: string;
}
