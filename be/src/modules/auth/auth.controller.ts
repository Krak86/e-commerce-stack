import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
  Patch,
  Delete,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';

import { MailService } from '@/modules/mail/mail.service';
import { verbose } from '@/utils/helper';
import { Role, type JwtPayload } from '@/utils/type';
import { AddResponseDto } from '@/modules/users/dto/add.dto';
import { Roles, User } from '@/common/decorators';
import { setRangeHeaders } from '@/common/utils';
import {
  ResponseRefreshToken,
  ResponseRemoveRefreshToken,
} from '@/common/interceprors';
import { AuthGuard, RefreshGuard, RolesGuard } from '@/common/guards';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AddDto, DeleteDto, EditDto } from './dto';
import type { AccessEntity } from './entities';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  @UseInterceptors(ResponseRefreshToken)
  @Post(['register', 'signup'])
  async register(@Body() dto: RegisterDto): Promise<AccessEntity> {
    const response = await this.authService.register(dto);

    await this.mailService.sendRegister(dto);
    return response;
  }

  @UseInterceptors(ResponseRefreshToken)
  @HttpCode(HttpStatus.OK)
  @Post(['login', 'signin'])
  async login(@Body() dto: LoginDto): Promise<AccessEntity> {
    return await this.authService.login(dto);
  }

  @UseInterceptors(ResponseRefreshToken)
  @UseGuards(AuthGuard, RolesGuard, RefreshGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('refresh')
  async refresh(
    @User('refreshToken') refreshTokenLegacy: string,
  ): Promise<AccessEntity> {
    return await this.authService.refresh(refreshTokenLegacy);
  }

  @UseInterceptors(ResponseRemoveRefreshToken)
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.USER, Role.ADMIN)
  @Post('logout')
  logout(): Record<string, string> {
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(['users', 'users/all'])
  async allUsers(
    @Headers('range') range: string | undefined,
    @Res({ passthrough: true }) res: Response,
    @User() user: JwtPayload,
  ): Promise<AddResponseDto[] | void> {
    verbose(() => console.log('User:', user));
    if (range) {
      const total = await this.authService.allUsers();
      setRangeHeaders(res, total.length);
    } else {
      return await this.authService.allUsers();
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('users')
  async addUser(@Body() dto: AddDto): Promise<AddResponseDto> {
    return await this.authService.addUser(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('users')
  async editUser(@Body() dto: EditDto): Promise<AddResponseDto> {
    return await this.authService.editUser(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('users')
  async deleteUser(@Body() dto: DeleteDto): Promise<void> {
    await this.authService.deleteUser(dto);
  }

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('me')
  async me() {}

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('forgot-password')
  async forgotPassword() {}

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('reset-password')
  async resetPassword() {}

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('change-password')
  async changePassword() {}

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('verify-email')
  async verifyEmail() {}

  // TODO: implement me
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('resend-verification')
  async resendVerification() {}
}
