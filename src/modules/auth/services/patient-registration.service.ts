import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SharedAuthService } from './shared-auth.service';
import { VerificationService } from './verification.service';
import { RegisterPatientDto } from '../dto/register-patient.dto';

/**
 * Servicio especializado para registro de pacientes
 */
@Injectable()
export class PatientRegistrationService {
  constructor(
    private prisma: PrismaService,
    private sharedAuth: SharedAuthService,
    private verification: VerificationService,
  ) {}

  /**
   * Registra un nuevo paciente con su perfil completo
   */
  async registerPatient(registerPatientDto: RegisterPatientDto) {
    const { email, username, password, ...patientData } = registerPatientDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El email o usuario ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await this.sharedAuth.hashPassword(password);

    // Crear usuario y paciente en una transacción
    const user = await this.prisma.$transaction(async (prisma) => {
      // Crear usuario
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash: hashedPassword,
          isActive: true,
          isEmailVerified: false,
        },
      });

      // Asignar rol de paciente
      const patientRole = await prisma.role.findUnique({
        where: { name: 'paciente' },
      });

      if (patientRole) {
        await prisma.userRole.create({
          data: {
            userId: newUser.id,
            roleId: patientRole.id,
          },
        });
      }

      // Crear perfil de paciente
      await prisma.patient.create({
        data: {
          userId: newUser.id,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          birthDate: new Date(patientData.birthDate),
          gender: patientData.gender,
          civilStatus: patientData.civilStatus,
          occupation: patientData.occupation,
          educationLevel: patientData.educationLevel,
          phone: patientData.phone,
          email: email,
          address: patientData.address,
          emergencyName: patientData.emergencyName,
          emergencyPhone: patientData.emergencyPhone,
          emergencyRelationship: patientData.emergencyRelationship,
          alcoholUse: patientData.alcoholUse,
          tobaccoUse: patientData.tobaccoUse,
          isActive: true,
        },
      });

      return newUser;
    });

    // Enviar código de verificación
    await this.verification.sendVerificationCode(email, user.id);

    return {
      message:
        'Paciente registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }
}
