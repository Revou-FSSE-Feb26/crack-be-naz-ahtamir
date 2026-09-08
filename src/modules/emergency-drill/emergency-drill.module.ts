import { Module } from '@nestjs/common';
import { EmergencyDrillService } from './emergency-drill.service';
import { EmergencyDrillController } from './emergency-drill.controller';

@Module({
  controllers: [EmergencyDrillController],
  providers: [EmergencyDrillService],
  exports: [EmergencyDrillService],
})
export class EmergencyDrillModule {}
