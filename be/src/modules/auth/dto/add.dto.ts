import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
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
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsString()
  @IsIn(ROLES as readonly string[], {
    message: `role must be one of: ${ROLES.join(', ')}`,
  })
  role: Extract<user_role, 'admin' | 'user'>;
}
