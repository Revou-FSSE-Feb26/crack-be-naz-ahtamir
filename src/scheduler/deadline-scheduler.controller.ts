import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { DeadlineSchedulerService } from './deadline-scheduler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Endpoint admin-only untuk trigger pengecekan deadline secara manual.
 * Berguna untuk testing atau menjalankan ulang di luar jadwal cron.
 *
 * POST /api/scheduler/check-deadlines
 * POST /api/scheduler/check-deadlines?force=true  → skip dedup harian
 */
@Controller('api/scheduler')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeadlineSchedulerController {
  constructor(private readonly schedulerService: DeadlineSchedulerService) {}

  @Post('check-deadlines')
  @Roles('admin')
  async triggerDeadlineCheck(
    @Query('force') force?: string,
  ): Promise<{
    message: string;
    created: number;
    skipped: number;
  }> {
    const result = await this.schedulerService.runNow(force === 'true');
    return {
      message: `Pengecekan deadline selesai.`,
      created: result.created,
      skipped: result.skipped,
    };
  }
}
