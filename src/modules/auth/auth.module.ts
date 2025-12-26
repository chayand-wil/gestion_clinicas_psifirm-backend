import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { SharedAuthService } from './services/shared-auth.service';
import { VerificationService } from './services/verification.service';
import { PasswordRecoveryService } from './services/password-recovery.service';
import { PatientRegistrationService } from './services/patient-registration.service';
import { EmployeeRegistrationService } from './services/employee-registration.service';
import { UserManagementService } from './services/user-management.service';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    SharedAuthService,
    VerificationService,
    PasswordRecoveryService,
    PatientRegistrationService,
    EmployeeRegistrationService,
    UserManagementService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
