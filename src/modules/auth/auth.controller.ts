import { Body, Controller, UseGuards, Post, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o usuario ya existen' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-patient')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar nuevo paciente con perfil completo' })
  @ApiResponse({ status: 201, description: 'Paciente registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o usuario ya existen' })
  registerPatient(@Body() registerPatientDto: RegisterPatientDto) {
    return this.authService.registerPatient(registerPatientDto);
  }

  @Post('register-employee')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar nuevo empleado con perfil completo' })
  @ApiResponse({ status: 201, description: 'Empleado registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o usuario ya existen' })
  @ApiResponse({ status: 400, description: 'Área de especialidad o roles no existen' })
  registerEmployee(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.authService.registerEmployee(registerEmployeeDto);
  }
  
  @Post('register-patient-public')
  @ApiOperation({ summary: 'Registrar nuevo paciente con perfil completo' })
  @ApiResponse({ status: 201, description: 'Paciente registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o usuario ya existen' })
  registerPatientP(@Body() registerPatientDto: RegisterPatientDto) {
    return this.authService.registerPatient(registerPatientDto);
  }

  @Post('register-employee-public')
  @ApiOperation({ summary: 'Registrar nuevo empleado con perfil completo' })
  @ApiResponse({ status: 201, description: 'Empleado registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o usuario ya existen' })
  @ApiResponse({ status: 400, description: 'Área de especialidad o roles no existen' })
  registerEmployeeP(@Body() registerEmployeeDto: RegisterEmployeeDto) {
    return this.authService.registerEmployee(registerEmployeeDto);
  }

  @Post('update-employee')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar información de un empleado existente' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Empleado, roles o área de especialidad no existen' })
  @ApiResponse({ status: 409, description: 'Email ya está en uso' })
  updateEmployee(@Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.authService.updateEmployee(updateEmployeeDto);
  }

  @Get('employees/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener información de un empleado' })
  @ApiResponse({ status: 200, description: 'Datos del empleado' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  getEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getEmployee(id);
  }

  @Get('employees')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener lista de todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados' })
  listEmployees() {
    return this.authService.listEmployees();
  }

  @Get('patients/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener información de un paciente' })
  @ApiResponse({ status: 200, description: 'Datos del paciente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  getPatient(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getPatient(id);
  }

  @Get('patients')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener lista de todos los pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes' })
  listPatients() {
    return this.authService.listPatients();
  }



  


  

  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar correo con código' })
  @ApiResponse({ status: 200, description: 'Correo verificado exitosamente' })
  @ApiResponse({ status: 400, description: 'Código inválido o expirado' })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-code')
  @ApiOperation({ summary: 'Reenviar código de verificación' })
  @ApiResponse({ status: 200, description: 'Código reenviado' })
  @ApiResponse({ status: 400, description: 'Usuario no encontrado' })
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendVerificationCode(resendCodeDto);
  }
  

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'Se envió el correo de recuperación (si el usuario existe)' })
  @ApiResponse({ status: 400, description: 'Usuario no encontrado' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reestablecer contraseña con token' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
