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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FindingsService } from './findings.service';
import { CreateFindingDto } from './dto/create-finding.dto';
import { UpdateFindingDto } from './dto/update-finding.dto';
import { UpdateFindingStatusDto } from './dto/update-finding-status.dto';
import { Finding } from '@prisma/client';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

@ApiTags('SMK3 Data / Findings')
@ApiBearerAuth()
@Controller('api/smk3-data')
@UseGuards(JwtAuthGuard)
export class FindingsController {
  constructor(private findingsService: FindingsService) {}

  // ── POST create ───────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create new Finding with optional files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subElementId: { type: 'string', example: 'SE-001' },
        title: { type: 'string', example: 'Tidak ada APAR di area A' },
        findingStatus: { type: 'string', enum: ['INPG', 'CLSD'], example: 'INPG' },
        data: { type: 'string', description: 'JSON string dari data temuan' },
        dokumentasiHazard: { type: 'string', format: 'binary' },
        dokumentasiPerbaikan: { type: 'string', format: 'binary' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Finding created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    const user = req.user;
    if (!user || !user.id) throw new BadRequestException('User tidak terautentikasi');

    let dto: CreateFindingDto;
    if (typeof body.data === 'string') {
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
      dto = body as CreateFindingDto;
    }

    if (!dto.subElementId) throw new BadRequestException('subElementId wajib diisi');
    if (!dto.title) throw new BadRequestException('title wajib diisi');

    return this.findingsService.create(dto, user.id, user, uploadedFiles);
  }

  // ── GET deadline-reminders ────────────────────────────────────────────────

  @Get('deadline-reminders')
  @ApiOperation({ summary: 'Get deadline reminders for findings' })
  @ApiQuery({ name: 'daysAhead', required: false, type: 'number', description: 'Jumlah hari ke depan (default: 3)' })
  @ApiResponse({ status: 200, description: 'List deadline reminders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDeadlineReminders(
    @Request() req: any,
    @Query('daysAhead') daysAhead?: string,
  ): Promise<any[]> {
    const user = req.user;
    const userId = user.role === 'user' ? user.id : undefined;
    const days = daysAhead ? parseInt(daysAhead, 10) : 3;
    return this.findingsService.getDeadlineReminders(userId, days);
  }

  // ── GET all ───────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all Findings (with optional filters)' })
  @ApiQuery({ name: 'findingStatus', required: false, enum: ['INPG', 'CLSD'] })
  @ApiQuery({ name: 'subElementId', required: false, type: 'string' })
  @ApiQuery({ name: 'createdById', required: false, type: 'string' })
  @ApiQuery({ name: 'departemen', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'List of findings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('findingStatus') findingStatus?: string,
    @Query('subElementId') subElementId?: string,
    @Query('createdById') createdById?: string,
    @Query('departemen') departemen?: string,
  ): Promise<Finding[]> {
    return this.findingsService.findAll({ findingStatus, subElementId, createdById, departemen });
  }

  // ── GET one ───────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get one Finding by ID' })
  @ApiParam({ name: 'id', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'Finding detail' })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<Finding> {
    return this.findingsService.findOne(id);
  }

  // ── PUT update ────────────────────────────────────────────────────────────

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Update Finding (title, data)' })
  @ApiParam({ name: 'id', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'Finding updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya admin/supervisor' })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateFindingDto: UpdateFindingDto,
  ): Promise<Finding> {
    return this.findingsService.update(id, updateFindingDto);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Soft delete Finding by ID' })
  @ApiParam({ name: 'id', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'Finding deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya admin/supervisor' })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.findingsService.softDelete(id);
    return { message: 'Finding berhasil dihapus' };
  }

  // ── PATCH status ──────────────────────────────────────────────────────────

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update Finding status with approval info' })
  @ApiParam({ name: 'id', description: 'Finding ID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden — hanya admin' })
  @ApiResponse({ status: 404, description: 'Finding not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateFindingStatusDto,
    @Request() req: any,
  ): Promise<Finding> {
    const user = req.user;
    if (!user || !user.id) throw new BadRequestException('User tidak terautentikasi');
    return this.findingsService.updateStatus(id, updateStatusDto, user.id, user);
  }
}
