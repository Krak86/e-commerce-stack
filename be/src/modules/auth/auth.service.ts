import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

import { UsersRepository } from '@/modules/users/users.repository';
import { AddResponseDto } from '@/modules/users/dto';
import { TOKENS_LIFETIME } from '@/utils/static';
import { RegisterDto, LoginDto, AddDto, DeleteDto, EditDto } from './dto';
import { RegisterEntity } from './entities';

@Injectable()
export class AuthService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor(
    private jwt: JwtService,
    private usersService: UsersRepository,
    private config: ConfigService,
  ) {
    this.accessSecret = this.config.get<string>('ACCESS_SECRET') || '';
    this.refreshSecret = this.config.get<string>('REFRESH_SECRET') || '';
  }

  async register(dto: RegisterDto): Promise<RegisterEntity> {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // generate password hash
    const password_hash = await this.getPasswordHash(dto.password);
    // create user
    const user = await this.usersService.createUser({
      email: dto.email,
      password_hash,
      name: dto.name,
      role: 'user',
    });

    const { accessToken, refreshToken } = this.generateTokens(user);
    return { accessToken, refreshToken };
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // check password
    const isMatch = await this.comparePassword(
      dto.password,
      user.password_hash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } = this.generateTokens(user);
    return { accessToken, refreshToken };
  }

  async refresh(
    refreshTokenLegacy: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshTokenLegacy, {
        secret: this.refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      return { accessToken, refreshToken };
    } catch (_) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async allUsers(): Promise<AddResponseDto[]> {
    return await this.usersService.allUsers();
  }

  async addUser(dto: AddDto): Promise<AddResponseDto> {
    // check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // generate password hash
    const password_hash = await hash(dto.password, 10);
    // create user
    return await this.usersService.createUser({
      email: dto.email,
      password_hash,
      name: dto.name,
      role: dto.role,
    });
  }

  async editUser(dto: EditDto): Promise<AddResponseDto> {
    const { id } = dto;

    const existingUser = await this.usersService.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    // update user
    return await this.usersService.updateUser({
      name: (dto.name || existingUser.name) ?? 'User',
      role: (dto.role || existingUser.role) ?? 'user',
      password_hash: dto.password
        ? await this.getPasswordHash(dto.password)
        : existingUser.password_hash,
      id,
    });
  }

  async deleteUser(dto: DeleteDto): Promise<void> {
    const { id } = dto;
    // check if user exists
    const existingUser = await this.usersService.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    // delete user
    await this.usersService.deleteUser(id);
  }

  private generateTokens(
    user: Record<'id' | 'email' | 'role', string>,
  ): RegisterEntity {
    const { id, email, role } = user;

    const payload = { sub: id, email, role };

    const accessToken =
      this.jwt.sign(payload, {
        secret: this.accessSecret,
        expiresIn: TOKENS_LIFETIME.access,
      }) ?? '';

    const refreshToken =
      this.jwt.sign(payload, {
        secret: this.refreshSecret,
        expiresIn: TOKENS_LIFETIME.refresh,
      }) ?? '';

    return { accessToken, refreshToken };
  }

  private async getPasswordHash(pass: string): Promise<string> {
    return await hash(pass, 10);
  }

  private async comparePassword(
    password: string,
    password_hash: string,
  ): Promise<boolean> {
    return await compare(password, password_hash);
  }
}
