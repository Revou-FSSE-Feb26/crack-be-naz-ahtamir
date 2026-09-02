import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto, UpsertDepartmentsDto } from './dto/create-department.dto';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('api/departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly svc: DepartmentsService) {}

  // ── GET /api/departments ──────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List semua departemen', description: 'Mengembalikan array departemen diurutkan abjad.' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  findAll() {
    return this.svc.findAll();
  }

  // ── GET /api/departments/:id ──────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Detail satu departemen' })
  @ApiParam({ name: 'id', description: 'UUID departemen' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  // ── POST /api/departments ─────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Tambah satu departemen baru' })
  @ApiResponse({ status: 201, description: 'Berhasil dibuat' })
  @ApiResponse({ status: 409, description: 'Kode departemen sudah ada' })
  create(@Body() dto: CreateDepartmentDto) {
    return this.svc.create(dto);
  }

  // ── POST /api/departments/seed ────────────────────────────────────────────

  @Post('seed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed / upsert banyak departemen sekaligus',
    description:
      'Idempotent — insert departemen yang belum ada, skip yang sudah ada. ' +
      'Kembalikan ringkasan: inserted, skipped, total.',
  })
  @ApiResponse({ status: 200, description: 'Seeder berhasil dijalankan' })
  seed(@Body() dto: UpsertDepartmentsDto) {
    return this.svc.upsertMany(dto.departments);
  }

  // ── PUT /api/departments/:id ──────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Update nama/kode departemen' })
  @ApiParam({ name: 'id', description: 'UUID departemen' })
  @ApiResponse({ status: 200, description: 'Berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateDepartmentDto>) {
    return this.svc.update(id, dto);
  }

  // ── DELETE /api/departments/:id ───────────────────────────────────────────

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus departemen' })
  @ApiParam({ name: 'id', description: 'UUID departemen' })
  @ApiResponse({ status: 200, description: 'Berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
