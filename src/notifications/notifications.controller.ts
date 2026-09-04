import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * GET /api/notifications?limit=10
   * Ambil notifikasi milik user yang sedang login.
   * userId diambil dari JWT — bukan dari query param.
   */
  @Get()
  async findByUserId(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.findByUserId(
      req.user.id,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  /**
   * GET /api/notifications/unread-count
   * Hitung notifikasi yang belum dibaca milik user yang login.
   */
  @Get('unread-count')
  async getUnreadCount(
    @Request() req: any,
  ): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  /**
   * POST /api/notifications
   * Buat notifikasi baru — untuk admin, system, atau seeder.
   * Hanya admin yang boleh membuat notifikasi manual.
   */
  @Post()
  @Roles('admin')
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(createNotificationDto);
  }

  /**
   * PATCH /api/notifications/read-all
   * Tandai semua notifikasi user yang login sebagai sudah dibaca.
   * Harus di atas /:id/read agar tidak terambil sebagai :id = 'read-all'
   */
  @Patch('read-all')
  async markAllAsRead(
    @Request() req: any,
  ): Promise<{ message: string; count: number }> {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  /**
   * PATCH /api/notifications/:id/read
   * Tandai satu notifikasi sebagai sudah dibaca.
   * Hanya bisa menandai notifikasi milik user yang login.
   */
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
