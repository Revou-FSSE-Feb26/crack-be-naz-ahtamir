import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FindingsService } from './findings.service';
import { FindingsController } from './findings.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key_12345', // Match dengan .env
      signOptions: { expiresIn: '7d' },
    }),
    NotificationsModule,
  ],
  providers: [
    FindingsService,
    PrismaService,
  ],
  controllers: [FindingsController],
})
export class FindingsModule {}