import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpecialtyAreaModule } from './modules/specialty-area/specialty-area.module';
import { RolesModule } from './modules/roles/roles.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { EmployeeScheduleModule } from './modules/employee-schedule/employee-schedule.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PrescriptionsModule } from './modules/prescriptions/prescriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PayrollsModule } from './modules/payrolls/payrolls.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [PrismaModule, AuthModule, SpecialtyAreaModule, RolesModule, AppointmentsModule, EmployeeScheduleModule, MedicalRecordsModule, InventoryModule, PrescriptionsModule, PaymentsModule, InvoicesModule, PayrollsModule, ReportsModule],
  controllers: [
    AppController,
    HealthController,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: BigIntSerializerInterceptor,
    },
  ],
})
export class AppModule {}
