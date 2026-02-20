import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'users', description: 'Resource name' })
  @IsString()
  @MaxLength(100)
  resource!: string;

  @ApiProperty({ example: 'create', description: 'Action (e.g. create, read)' })
  @IsString()
  @MaxLength(50)
  action!: string;
}
