import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService, UploadResult } from './uploads.service';
import type { MulterFile } from './uploads.service';

@Controller('api/uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile,
    @Body('subElementId') subElementId: string,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!subElementId) {
      throw new BadRequestException('subElementId is required');
    }

    return this.uploadsService.uploadFile(file, subElementId);
  }
}
