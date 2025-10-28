import { Controller } from '@nestjs/common';
import { ThrottlerConfigService } from './throttler-config.service';

@Controller('throttler-config')
export class ThrottlerConfigController {
  constructor(
    private readonly throttlerConfigService: ThrottlerConfigService,
  ) {}
}
