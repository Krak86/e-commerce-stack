import { Role } from '@/utils/type';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: '1', description: 'User ID', nullable: true })
  id: string | null;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    example: 'John Doe',
    description: 'User name',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
    nullable: true,
    required: false,
  })
  avatar_url?: string | null;

  @ApiProperty({
    example: '2025-10-03T12:00:00.000Z',
    description: 'Account creation date',
    nullable: true,
  })
  created_at: Date | null;

  @ApiProperty({
    example: 'user',
    description: 'User role',
  })
  role: Role;
}

export class RegisterEntity {
  @ApiProperty({ example: 'jwt-access-token', description: 'Access token' })
  accessToken: string;

  @ApiProperty({ example: 'jwt-refresh-token', description: 'Refresh token' })
  refreshToken: string;
}

export class RefreshToken {
  @ApiProperty({ example: 'jwt-refresh-token', description: 'Refresh token' })
  refreshToken?: string;
}

export class AccessEntity extends RefreshToken {
  @ApiProperty({ example: 'jwt-access-token', description: 'Access token' })
  accessToken: string;
}
