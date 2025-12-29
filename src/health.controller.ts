import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'nestjs',
      timestamp: new Date().toISOString(),
    };
  }
}
