import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@/common/decorators';
import { AuthGuard, RolesGuard } from '@/common/guards';
import { Role } from '@/utils/type';
import { MailService } from './mail.service';
import { MailDto } from './dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('register')
  async sendRegister(@Body() dto: MailDto): Promise<void> {
    return this.mailService.sendRegister(dto);
  }
}
