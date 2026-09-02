// src/modules/k3-policy/k3-policy.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { K3PolicyService } from './k3-policy.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { MulterFile } from '../../uploads/uploads.service';

type DiskFile = MulterFile & { filename?: string; path?: string };

@ApiTags('K3 Policy')
@ApiBearerAuth()
@Controller('api/k3-policy')
@UseGuards(JwtAuthGuard)
export class K3PolicyController {
  constructor(private readonly service: K3PolicyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all K3 Policy records' })
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one K3 Policy by ID' })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('with-file')
  @ApiOperation({ summary: 'Create K3 Policy with optional file upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'public', 'uploads', 'k3-policy'),
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const ext = extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async createWithFile(
    @Request() req,
    @Body('jenisKebijakan') jenisKebijakan: string,
    @Body('judulKebijakan') judulKebijakan: string,
    @Body('tanggalPenetapan') tanggalPenetapan: string,
    @Body('penandatangan') penandatangan: string,
    @Body('jabatan') jabatan: string,
    @Body('statusDokumen') statusDokumen: string,
    @Body('statusDistribusi') statusDistribusi: string,
    @Body('statusValidasi') statusValidasi: string,
    @UploadedFile() file: DiskFile,
  ) {
    const fileUrl = file?.filename
      ? `/uploads/k3-policy/${file.filename}`
      : undefined;

    return this.service.create(req.user.id, {
      jenisKebijakan: jenisKebijakan as any,
      judulKebijakan,
      tanggalPenetapan,
      penandatangan,
      jabatan,
      statusDokumen: statusDokumen as any,
      statusDistribusi: statusDistribusi as any,
      statusValidasi: statusValidasi as any,
      fileUrl,
    } as any);
  }

  @Put('with-file/:id')
  @ApiOperation({ summary: 'Update K3 Policy with optional file upload' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'public', 'uploads', 'k3-policy'),
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        const ext = extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateWithFile(
    @Param('id') id: string,
    @Request() req,
    @Body('jenisKebijakan') jenisKebijakan: string,
    @Body('judulKebijakan') judulKebijakan: string,
    @Body('tanggalPenetapan') tanggalPenetapan: string,
    @Body('penandatangan') penandatangan: string,
    @Body('jabatan') jabatan: string,
    @Body('statusDokumen') statusDokumen: string,
    @Body('statusDistribusi') statusDistribusi: string,
    @Body('statusValidasi') statusValidasi: string,
    @UploadedFile() file: DiskFile,
  ) {
    const fileUrl = file?.filename
      ? `/uploads/k3-policy/${file.filename}`
      : undefined;

    return this.service.update(id, req.user.id, {
      jenisKebijakan: jenisKebijakan as any,
      judulKebijakan,
      tanggalPenetapan,
      penandatangan,
      jabatan,
      statusDokumen: statusDokumen as any,
      statusDistribusi: statusDistribusi as any,
      statusValidasi: statusValidasi as any,
      ...(fileUrl !== undefined && { fileUrl }),
    } as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete K3 Policy by ID' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.service.delete(id, req.user.id);
  }
}
