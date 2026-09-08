import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FindingsModule } from './findings/findings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { K3PolicyModule } from './modules/k3-policy/k3-policy.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DeadlineSchedulerModule } from './scheduler/deadline-scheduler.module';
import { LicenseSchedulerModule } from './scheduler/license-scheduler.module';
import { InductionModule } from './modules/induction/induction.module';
import { ObjekK3Module } from './modules/objek-k3/objek-k3.module';
import { EmergencyDrillModule } from './modules/emergency-drill/emergency-drill.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    FindingsModule,
    NotificationsModule,
    UploadsModule,
    K3PolicyModule,
    DepartmentsModule,
    DocumentsModule,
    DeadlineSchedulerModule,
    LicenseSchedulerModule,
    InductionModule,
    ObjekK3Module,
    EmergencyDrillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
