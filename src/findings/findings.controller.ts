import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  Query,
  BadRequestException,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FindingsService } from './findings.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { UpdateFindingDto } from './dto/update-finding.dto';
import { UpdateFindingStatusDto } from './dto/update-finding-status.dto';
import { Finding } from '@prisma/client';

// Gunakan process.cwd() agar path selalu relatif ke root project,
// tidak terpengaruh oleh __dirname (berbeda antara dev dan prod)
const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

@Controller('api/smk3-data')
@UseGuards(JwtAuthGuard)
export class FindingsController {
  constructor(private findingsService: FindingsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'dokumentasiHazard', maxCount: 1 },
        { name: 'dokumentasiPerbaikan', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: UPLOADS_DIR,
          filename: (_req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, unique + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async create(
    @Request() req: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: any,
  ): Promise<Finding> {
    // Ambil user dari JWT (request.user di-set oleh JwtAuthGuard)
    const user = req.user;
    if (!user || !user.id) {
      throw new BadRequestException('User tidak terautentikasi');
    }

    // Support both JSON body dan FormData
    let dto: CreateFindingDto;
    if (typeof body.data === 'string') {
      // FormData: field 'data' berisi JSON string
      try {
        dto = {
          subElementId: body.subElementId,
          title: body.title,
          findingStatus: body.findingStatus,
          data: JSON.parse(body.data),
        };
      } catch {
        throw new BadRequestException('Format data tidak valid');
      }
    } else {
      // JSON body biasa
      dto = body as CreateFindingDto;
    }

    if (!dto.subElementId) {
      throw new BadRequestException('subElementId wajib diisi');
    }
    if (!dto.title) {
      throw new BadRequestException('title wajib diisi');
    }

    return this.findingsService.create(dto, user.id, user, uploadedFiles);
  }

  @Get('deadline-reminders')
  async getDeadlineReminders(
    @Request() req: any,
    @Query('daysAhead') daysAhead?: string,
  ): Promise<any[]> {
    const user = req.user;
    // Role user: hanya lihat reminder milik sendiri
    // Supervisor/admin: lihat semua
    const userId = user.role === 'user' ? user.id : undefined;
    const days = daysAhead ? parseInt(daysAhead, 10) : 3;
    return this.findingsService.getDeadlineReminders(userId, days);
  }

  @Get()
  async findAll(
    @Query('findingStatus') findingStatus?: string,
    @Query('subElementId') subElementId?: string,
    @Query('createdById') createdById?: string,
    @Query('departemen') departemen?: string,
  ): Promise<Finding[]> {
    return this.findingsService.findAll({
      findingStatus,
      subElementId,
      createdById,
      departemen,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Finding> {
    return this.findingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFindingDto: UpdateFindingDto,
  ): Promise<Finding> {
    return this.findingsService.update(id, updateFindingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.findingsService.softDelete(id);
    return { message: 'Finding berhasil dihapus' };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateFindingStatusDto,
    @Request() req: any,
  ): Promise<Finding> {
    const user = req.user;
    if (!user || !user.id) {
      throw new BadRequestException('User tidak terautentikasi');
    }
    return this.findingsService.updateStatus(id, updateStatusDto, user.id, user);
  }
}
