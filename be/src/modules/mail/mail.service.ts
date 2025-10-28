import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

import { MailDto } from './dto';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendRegister(dto: MailDto): Promise<void> {
    const { name } = dto;

    console.log('sendRegister input:', dto);

    const response = await this.resend.emails.send({
      from: 'Shop <rukrak86@gmail.com>',
      to: 'rukrak86@gmail.com',
      subject: 'Welcome!',
      html: `<h1>Hello ${name}</h1><p>Thanks for registering!</p>`,
    });

    console.log('sendRegister response:', response);
  }

  async sendPasswordReset() {}
}
