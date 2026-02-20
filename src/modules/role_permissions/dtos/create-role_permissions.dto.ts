import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateRole_permissionDto {
  @ApiProperty({ example: 'uuid', description: 'Role id' })
  @IsUUID()
  roleId!: string;

  @ApiProperty({ example: 'uuid', description: 'Permission id' })
  @IsUUID()
  permissionId!: string;
}
