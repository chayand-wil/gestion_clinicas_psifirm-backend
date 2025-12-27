import { ApiProperty } from '@nestjs/swagger';

export class AppointmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  patientId: number;

  @ApiProperty({ example: 1 })
  employeeId: number;

  @ApiProperty({ example: '2025-12-28T10:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 'PENDIENTE' })
  status: string;

  @ApiProperty({ example: '50.00' })
  cost: string;

  @ApiProperty({ example: 1, nullable: true })
  sessionId: number | null;

  @ApiProperty({ example: '2025-12-27T15:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-12-27T15:30:00.000Z' })
  updatedAt: Date;
}
