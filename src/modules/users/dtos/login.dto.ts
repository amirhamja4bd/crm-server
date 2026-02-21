import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email or username',
  })
  @IsString()
  @MaxLength(255)
  loginIdentifier!: string;

  @ApiProperty({ example: 'strongpassword', description: 'Password' })
  @IsString()
  @MaxLength(255)
  password!: string;
}
