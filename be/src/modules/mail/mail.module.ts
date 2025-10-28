import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  providers: [
    {
      provide: MailService,
      useClass: MailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
