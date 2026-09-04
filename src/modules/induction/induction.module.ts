import { Module } from '@nestjs/common';
import { InductionService } from './induction.service';
import { InductionController, InductionPublicController } from './induction.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InductionController, InductionPublicController],
  providers: [InductionService],
  exports: [InductionService],
})
export class InductionModule {}
