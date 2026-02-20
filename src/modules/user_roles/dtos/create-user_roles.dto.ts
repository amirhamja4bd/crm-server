import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateUser_roleDto {
  @ApiProperty({ example: 'uuid', description: 'User id' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 'uuid', description: 'Role id' })
  @IsUUID()
  roleId!: string;
}
