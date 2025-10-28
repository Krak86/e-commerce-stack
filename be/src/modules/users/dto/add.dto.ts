import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ROLES } from '@/utils/static';
import { user_role } from '@prisma/client/wasm';

export class AddDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  @IsString()
  password_hash: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  @IsIn(ROLES as readonly string[], {
    message: `role must be one of: ${ROLES.join(', ')}`,
  })
  role: Extract<user_role, 'admin' | 'user'>;
}

export class AddResponseDto {
  @ApiProperty({ example: 'uuid', description: 'User ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  role: string;

  @ApiProperty({
    example: null,
    description: 'User avatar URL',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar_url: string | null;
}

export class AddWithHashResponseDto {
  @ApiProperty({ example: 'uuid', description: 'User ID' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  role: string;

  @ApiProperty({
    example: null,
    description: 'User avatar URL',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar_url: string;

  @IsOptional()
  @IsString()
  password_hash: string;
}
