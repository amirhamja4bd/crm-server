import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrganizationUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  @IsString()
  @MaxLength(100)
  username!: string;

  @ApiProperty({ example: '+1234567890', description: 'Mobile number' })
  @IsString()
  @MaxLength(50)
  mobile!: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsString()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'strongpassword', description: 'User password' })
  @IsString()
  @MaxLength(255)
  password!: string;

  @ApiProperty({
    example: ['uuid1', 'uuid2'],
    description: 'Array of role IDs to assign to user',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  roleIds!: string[];

  @ApiProperty({ example: 'https://avatar.url', description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiProperty({
    example: 'pending',
    description: 'User status',
    enum: ['active', 'inactive', 'pending', 'blocked'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: false, description: 'Is verified' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ example: true, description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
