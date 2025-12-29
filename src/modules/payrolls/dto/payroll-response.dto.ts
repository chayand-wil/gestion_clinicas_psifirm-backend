import { ApiProperty } from '@nestjs/swagger';
import { PayrollStatus } from '@prisma/client';

export class PayrollResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  employeeId!: number;

  @ApiProperty()
  periodStart!: Date;

  @ApiProperty()
  periodEnd!: Date;

  @ApiProperty({ description: 'Salario base', example: '5000.00' })
  baseSalary!: string;

  @ApiProperty({ description: 'Bonificaciones', example: '250.00' })
  bonus!: string;

  @ApiProperty({ description: 'IGSS', example: '241.50' })
  igss!: string;

  @ApiProperty({ description: 'Deducciones', example: '100.00' })
  deductions!: string;

  @ApiProperty({ description: 'Salario neto', example: '4908.50' })
  netSalary!: string;

  @ApiProperty({ enum: PayrollStatus })
  status!: PayrollStatus;

  @ApiProperty({ required: false })
  paymentDate?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
