import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, AppointmentStatus } from './dto';
import { UpdateAppointmentDto } from './dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  const mockAppointment = {
    id: 1,
    patientId: 1,
    employeeId: 1,
    date: new Date('2025-12-28T10:00:00Z'),
    status: 'PENDIENTE',
    cost: 50.0,
    sessionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    patient: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '1234567890',
    },
    employee: {
      id: 1,
      firstName: 'Dr.',
      lastName: 'García',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAppointment),
            findAll: jest.fn().mockResolvedValue([mockAppointment]),
            findOne: jest.fn().mockResolvedValue(mockAppointment),
            findByPatient: jest.fn().mockResolvedValue([mockAppointment]),
            findByEmployee: jest.fn().mockResolvedValue([mockAppointment]),
            findByStatus: jest.fn().mockResolvedValue([mockAppointment]),
            update: jest.fn().mockResolvedValue(mockAppointment),
            remove: jest.fn().mockResolvedValue(mockAppointment),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createDto: CreateAppointmentDto = {
        patientId: 1,
        employeeId: 1,
        date: '2025-12-28T10:00:00Z',
        status: AppointmentStatus.PENDIENTE,
        cost: 50.0,
      };

      const result = await controller.create(createDto);

      expect(result).toEqual(mockAppointment);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockAppointment]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should filter by patientId', async () => {
      await controller.findAll(1);

      expect(service.findAll).toHaveBeenCalledWith({
        patientId: 1,
        employeeId: undefined,
        status: undefined,
        fromDate: undefined,
        toDate: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single appointment', async () => {
      const result = await controller.findOne(1);

      expect(result).toEqual(mockAppointment);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByPatient', () => {
    it('should return appointments for a specific patient', async () => {
      const result = await controller.findByPatient(1);

      expect(result).toEqual([mockAppointment]);
      expect(service.findByPatient).toHaveBeenCalledWith(1);
    });
  });

  describe('findByEmployee', () => {
    it('should return appointments for a specific employee', async () => {
      const result = await controller.findByEmployee(1);

      expect(result).toEqual([mockAppointment]);
      expect(service.findByEmployee).toHaveBeenCalledWith(1);
    });
  });

  describe('findByStatus', () => {
    it('should return appointments by status', async () => {
      const result = await controller.findByStatus('PENDIENTE');

      expect(result).toEqual([mockAppointment]);
      expect(service.findByStatus).toHaveBeenCalledWith('PENDIENTE');
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto: UpdateAppointmentDto = {
        status: AppointmentStatus.CONFIRMADA,
      };

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockAppointment);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an appointment', async () => {
      const result = await controller.remove(1);

      expect(result).toEqual(mockAppointment);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
