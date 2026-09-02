import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUserId(
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }

    return this.notificationsService.findByUserId(userId);
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(
    @Query('userId') userId: string,
  ): Promise<{ count: number }> {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }

    const count = await this.notificationsService.getUnreadCount(userId);

    return { count };
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(
    @Query('userId') userId: string,
  ): Promise<{ message: string; count: number }> {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }

    return this.notificationsService.markAllAsRead(userId);
  }
}