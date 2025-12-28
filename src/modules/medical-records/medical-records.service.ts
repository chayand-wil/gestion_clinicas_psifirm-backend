import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  // MedicalRecord CRUD
  create(data: CreateMedicalRecordDto) {
    return this.prisma.medicalRecord.create({ data: {
      recordNumber: data.recordNumber,
      patientId: data.patientId,
      psychologistId: data.psychologistId,
      specialtyAreaId: data.specialtyAreaId,
      status: data.status,
      openedAt: new Date(data.openedAt),
      closedAt: data.closedAt ? new Date(data.closedAt) : undefined,
    } });
  }

  findAll() {
    return this.prisma.medicalRecord.findMany();
  }

  findByPatient(patientId: number) {
    return this.prisma.medicalRecord.findMany({ where: { patientId } });
  }

  async findOne(id: number) {
    const rec = await this.prisma.medicalRecord.findUnique({ where: { id } });
    if (!rec) throw new NotFoundException('MedicalRecord not found');
    return rec;
  }

  update(id: number, data: UpdateMedicalRecordDto) {
    return this.prisma.medicalRecord.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.medicalRecord.delete({ where: { id } });
  }

  // InitialAssessment
  createInitialAssessment(data: CreateInitialAssessmentDto) {
    return this.prisma.initialAssessment.create({ data: {
      recordId: data.recordId,
      referralSource: data.referralSource,
      consultationReason: data.consultationReason,
      familyHistory: data.familyHistory,
      personalHistory: data.personalHistory,
      moodLevel: data.moodLevel,
      anxietyLevel: data.anxietyLevel,
      socialFunction: data.socialFunction,
      sleepQuality: data.sleepQuality,
      appetite: data.appetite,
      generalObservations: data.generalObservations,
    } });
  }

  getInitialAssessment(recordId: number) {
    return this.prisma.initialAssessment.findUnique({ where: { recordId } });
  }

  // PsychologicalTest
  createPsychologicalTest(data: CreatePsychologicalTestDto) {
    return this.prisma.psychologicalTest.create({ data: {
      recordId: data.recordId,
      name: data.name,
      score: data.score,
      interpretation: data.interpretation,
      appliedAt: new Date(data.appliedAt),
      attachmentUrl: data.attachmentUrl,
    } });
  }

  findPsychologicalTests(recordId: number) {
    return this.prisma.psychologicalTest.findMany({ where: { recordId } });
  }

  // Diagnosis
  createDiagnosis(data: CreateDiagnosisDto) {
    return this.prisma.diagnosis.create({ data: {
      recordId: data.recordId,
      cie11Code: data.cie11Code,
      type: data.type,
      description: data.description,
    } });
  }

  findDiagnoses(recordId: number) {
    return this.prisma.diagnosis.findMany({ 
      where: { recordId },
      include: { diagnosisDetails: true }  // ✅ NUEVO: Incluir detalles asociados
    });
  }

  // DiagnosisDetail (múltiples por diagnóstico)
  createDiagnosisDetail(data: CreateDiagnosisDetailDto) {
    return this.prisma.diagnosisDetail.create({ data: {
      diagnosisId: data.diagnosisId,
      predisponentes: data.predisponentes,
      precipitantes: data.precipitantes,
      mantenedores: data.mantenedores,
      functioningLevel: data.functioningLevel,
    } });
  }

  getDiagnosisDetails(diagnosisId: number) {
    return this.prisma.diagnosisDetail.findMany({ where: { diagnosisId } });
  }

  // TherapySession
  createTherapySession(data: CreateTherapySessionDto) {
    return this.prisma.therapySession.create({ data: {
      recordId: data.recordId,
      employeeId: data.employeeId,
      sessionNumber: data.sessionNumber,
      date: new Date(data.date),
      attended: data.attended,
      interventions: data.interventions,
      patientResponse: data.patientResponse,
      assignedTasks: data.assignedTasks ?? '',
      observations: data.observations ?? '',
      nextSessionDate: data.nextSessionDate ? new Date(data.nextSessionDate) : undefined,
    } });
  }

  findTherapySessions(recordId: number) {
    return this.prisma.therapySession.findMany({ where: { recordId } });
  }

  // TreatmentPlan
  async createTreatmentPlan(data: CreateTreatmentPlanDto) {
    const exists = await this.prisma.treatmentPlan.findUnique({ where: { recordId: data.recordId } });
    if (exists) throw new BadRequestException('Ya existe un plan de tratamiento para esta historia');

    return this.prisma.treatmentPlan.create({
      data: {
        recordId: data.recordId,
        shortTermGoal: data.shortTermGoal,
        mediumTermGoal: data.mediumTermGoal ?? undefined,
        longTermGoal: data.longTermGoal ?? undefined,
        modality: data.modality,
        therapeuticFocus: data.therapeuticFocus,
        frequency: data.frequency,
        sessionsPerWeek: data.sessionsPerWeek ?? 1,
        estimatedWeeks: data.estimatedWeeks ?? undefined,
        costPerSession: data.costPerSession,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        estimatedEndDate: data.estimatedEndDate ? new Date(data.estimatedEndDate) : undefined,
        isActive: data.isActive ?? undefined,
      },
    });
  }

  getTreatmentPlan(recordId: number) {
    return this.prisma.treatmentPlan.findUnique({ where: { recordId } });
  }

  // PeriodicEvaluation
  createPeriodicEvaluation(data: CreatePeriodicEvaluationDto) {
    return this.prisma.periodicEvaluation.create({
      data: {
        recordId: data.recordId,
        type: data.type,
        observedProgress: data.observedProgress,
        achievedGoals: data.achievedGoals,
        pendingGoals: data.pendingGoals,
        recommendations: data.recommendations,
        progressScale: data.progressScale,
        evaluatedAt: data.evaluatedAt ? new Date(data.evaluatedAt) : undefined,
      },
    });
  }

  findPeriodicEvaluations(recordId: number) {
    return this.prisma.periodicEvaluation.findMany({
      where: { recordId },
      orderBy: { evaluatedAt: 'desc' },
    });
  }

  // TherapeuticDischarge
  async createTherapeuticDischarge(data: CreateTherapeuticDischargeDto) {
    const exists = await this.prisma.therapeuticDischarge.findUnique({ where: { recordId: data.recordId } });
    if (exists) throw new BadRequestException('Ya existe un alta terapéutica para esta historia');

    return this.prisma.therapeuticDischarge.create({
      data: {
        recordId: data.recordId,
        dischargeDate: new Date(data.dischargeDate),
        reason: data.reason,
        patientStatus: data.patientStatus,
        recommendations: data.recommendations,
        followUpPlan: data.followUpPlan ?? undefined,
        patientSignature: data.patientSignature ?? undefined,
        therapistSignature: data.therapistSignature,
      },
    });
  }

  getTherapeuticDischarge(recordId: number) {
    return this.prisma.therapeuticDischarge.findUnique({ where: { recordId } });
  }
}
