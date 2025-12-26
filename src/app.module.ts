import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { SpecialtyAreaModule } from './modules/specialty-area/specialty-area.module';
import { RolesModule } from './modules/roles/roles.module';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';

@Module({
  imports: [PrismaModule, AuthModule, SpecialtyAreaModule, RolesModule],
  controllers: [
    AppController,
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
