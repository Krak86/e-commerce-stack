import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { user_role } from '@prisma/client/wasm';
import { ROLES } from '@/utils/static';

export class EditDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  @IsUUID('4', { message: 'userId must be a valid UUID v4' })
  id: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  @IsOptional()
  @IsIn(ROLES as readonly string[], {
    message: `role must be one of: ${ROLES.join(', ')}`,
  })
  role: Extract<user_role, 'admin' | 'user'>;
}
