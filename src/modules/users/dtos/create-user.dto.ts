import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email!: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  password!: string;
}
