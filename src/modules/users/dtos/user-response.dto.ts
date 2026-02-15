import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-or-id', description: 'User id' })
  id!: string;

  @ApiProperty({ example: true, description: 'Whether the user is active' })
  status!: boolean;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email!: string;

  @ApiProperty({ example: 'Full Name', description: 'User full name' })
  name!: string;
}
