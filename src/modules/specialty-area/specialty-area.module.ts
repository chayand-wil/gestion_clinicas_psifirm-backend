import { Module } from '@nestjs/common';
import { SpecialtyAreaController } from './specialty-area.controller';
import { SpecialtyAreaService } from './specialty-area.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialtyAreaController],
  providers: [SpecialtyAreaService],
})
export class SpecialtyAreaModule {}
