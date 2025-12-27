import { ApiProperty } from '@nestjs/swagger';

export class EmployeeScheduleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  employeeId: number;

  @ApiProperty({ example: 'LUNES' })
  dayOfWeek: string;

  @ApiProperty({ example: '2025-01-01T08:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2025-01-01T17:00:00.000Z' })
  endTime: Date;
}
