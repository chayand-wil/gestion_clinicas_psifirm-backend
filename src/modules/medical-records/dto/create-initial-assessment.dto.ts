import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsISO8601, IsOptional, IsBoolean } from 'class-validator';

export class CreateInitialAssessmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty()
  @IsString()
  referralSource: string;

  @ApiProperty()
  @IsString()
  consultationReason: string;

  @ApiProperty()
  @IsString()
  familyHistory: string;

  @ApiProperty()
  @IsString()
  personalHistory: string;

  @ApiProperty()
  @IsInt()
  moodLevel: number;

  @ApiProperty()
  @IsInt()
  anxietyLevel: number;

  @ApiProperty()
  @IsInt()
  socialFunction: number;

  @ApiProperty()
  @IsInt()
  sleepQuality: number;

  @ApiProperty()
  @IsInt()
  appetite: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  generalObservations?: string;
}
