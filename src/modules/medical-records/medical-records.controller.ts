import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateInitialAssessmentDto } from './dto/create-initial-assessment.dto';
import { CreatePsychologicalTestDto } from './dto/create-psychological-test.dto';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { CreateDiagnosisDetailDto } from './dto/create-diagnosis-detail.dto';
import { CreateTherapySessionDto } from './dto/create-therapy-session.dto';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { CreatePeriodicEvaluationDto } from './dto/create-periodic-evaluation.dto';
import { CreateTherapeuticDischargeDto } from './dto/create-therapeutic-discharge.dto';

@ApiTags('medical-records')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear historia clínica' })
  create(@Body() dto: CreateMedicalRecordDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar historias clínicas' })
  findAll() {
    return this.service.findAll();
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Obtener historias clínicas por ID de paciente' })
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.service.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener historia clínica por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar historia clínica' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicalRecordDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar historia clínica' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  // Initial Assessment
  @Post(':id/initial-assessment')
  @ApiOperation({ summary: 'Crear evaluación inicial para una historia' })
  createInitialAssessment(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateInitialAssessmentDto) {
    // ensure recordId consistency
    dto.recordId = id;
    return this.service.createInitialAssessment(dto);
  }

  @Get(':id/initial-assessment')
  getInitialAssessment(@Param('id', ParseIntPipe) id: number) {
    return this.service.getInitialAssessment(id);
  }

  // Psychological tests
  @Post(':id/psychological-tests')
  createPsychologicalTest(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePsychologicalTestDto) {
    dto.recordId = id;
    return this.service.createPsychologicalTest(dto);
  }

  @Get(':id/psychological-tests')
  findPsychologicalTests(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPsychologicalTests(id);
  }

  // Diagnoses
  @Post(':id/diagnoses')
  createDiagnosis(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDiagnosisDto) {
    dto.recordId = id;
    return this.service.createDiagnosis(dto);
  }

  @Get(':id/diagnoses')
  findDiagnoses(@Param('id', ParseIntPipe) id: number) {
    return this.service.findDiagnoses(id);
  }

  // Diagnosis details (múltiples por diagnóstico)
  @Post(':id/diagnosis-details')
  createDiagnosisDetail(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDiagnosisDetailDto) {
    // id es el recordId, dto.diagnosisId ya debe venir en el cuerpo
    return this.service.createDiagnosisDetail(dto);
  }

  @Get(':id/diagnosis-details/:diagnosisId')
  getDiagnosisDetails(@Param('diagnosisId', ParseIntPipe) diagnosisId: number) {
    return this.service.getDiagnosisDetails(diagnosisId);
  }

  // Therapy sessions
  @Post(':id/sessions')
  createTherapySession(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTherapySessionDto) {
    dto.recordId = id;
    return this.service.createTherapySession(dto);
  }

  @Get(':id/sessions')
  findTherapySessions(@Param('id', ParseIntPipe) id: number) {
    return this.service.findTherapySessions(id);
  }

  // Treatment plan
  @Post(':id/treatment-plan')
  @ApiOperation({ summary: 'Crear plan de tratamiento para una historia' })
  createTreatmentPlan(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTreatmentPlanDto) {
    dto.recordId = id;
    return this.service.createTreatmentPlan(dto);
  }

  @Get(':id/treatment-plan')
  @ApiOperation({ summary: 'Obtener plan de tratamiento por historia' })
  getTreatmentPlan(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTreatmentPlan(id);
  }

  // Periodic evaluations
  @Post(':id/periodic-evaluations')
  @ApiOperation({ summary: 'Registrar evaluación periódica de una historia' })
  createPeriodicEvaluation(@Param('id', ParseIntPipe) id: number, @Body() dto: CreatePeriodicEvaluationDto) {
    dto.recordId = id;
    return this.service.createPeriodicEvaluation(dto);
  }

  @Get(':id/periodic-evaluations')
  @ApiOperation({ summary: 'Listar evaluaciones periódicas de una historia' })
  findPeriodicEvaluations(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPeriodicEvaluations(id);
  }

  // Therapeutic discharge
  @Post(':id/therapeutic-discharge')
  @ApiOperation({ summary: 'Registrar alta terapéutica para una historia' })
  createTherapeuticDischarge(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTherapeuticDischargeDto) {
    dto.recordId = id;
    return this.service.createTherapeuticDischarge(dto);
  }

  @Get(':id/therapeutic-discharge')
  @ApiOperation({ summary: 'Obtener alta terapéutica por historia' })
  getTherapeuticDischarge(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTherapeuticDischarge(id);
  }
}
