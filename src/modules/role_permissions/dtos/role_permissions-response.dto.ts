import { ApiProperty } from '@nestjs/swagger';

export class Role_permissionResponseDto {
  @ApiProperty({ example: 'uuid-or-id', description: 'Id' })
  id!: string;

  @ApiProperty({ example: true, description: 'Whether active' })
  status!: boolean;

  @ApiProperty({ example: '', description: '' })
  name!: string;
}
