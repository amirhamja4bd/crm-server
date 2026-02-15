import { ApiPropertyOptional } from '@nestjs/swagger';
import { IBaseEntity } from '@/shared/types/types';

export class UpdateUserDto implements IBaseEntity {
  @ApiPropertyOptional({ example: 'uuid', description: 'Unique user identifier' })
  id?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'strongpassword', description: 'User password' })
  password?: string;

  @ApiPropertyOptional({ example: true, description: 'User active status' })
  status?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Soft delete flag' })
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
