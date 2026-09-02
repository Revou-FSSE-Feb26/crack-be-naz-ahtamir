import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: createNotificationDto,
    });
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        finding: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification dengan ID ${id} tidak ditemukan`,
      );
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(
    userId: string,
  ): Promise<{ message: string; count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      message: 'Semua notifikasi berhasil ditandai sebagai dibaca',
      count: result.count,
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}