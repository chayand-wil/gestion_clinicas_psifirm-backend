import { Module } from '@nestjs/common';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { EmployeeScheduleService } from './employee-schedule.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmployeeScheduleController],
  providers: [EmployeeScheduleService],
  exports: [EmployeeScheduleService],
})
export class EmployeeScheduleModule {}
