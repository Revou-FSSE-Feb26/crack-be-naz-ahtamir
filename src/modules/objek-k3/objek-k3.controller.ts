import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
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
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ObjekK3Service } from './objek-k3.service';
import { UpdateObjekK3Dto } from './dto/update-objek-k3.dto';
import { CreateRiwayatDto } from './dto/create-riwayat.dto';

// Upload destination for objek-k3 files
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'objek-k3');

function makeStorage() {
  return diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + extname(file.originalname));
    },
  });
}

function fileFilter(_req: any, file: Express.Multer.File, cb: any) {
  const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
  const ext = extname(file.originalname).toLowerCase();
  cb(null, allowed.includes(ext));
}

const LIMIT = { fileSize: 10 * 1024 * 1024 }; // 10 MB

type UploadedObjekFiles = {
  pengesahanGambar?: Express.Multer.File[];
  fileLHU?: Express.Multer.File[];
  fotoAlat?: Express.Multer.File[];
  fotoTagging?: Express.Multer.File[];
  sertifikat?: Express.Multer.File[];
  laporanPemeriksaan?: Express.Multer.File[];
};

const FILE_FIELDS_OBJEK = [
  { name: 'pengesahanGambar', maxCount: 1 },
  { name: 'fileLHU', maxCount: 1 },
  { name: 'fotoAlat', maxCount: 1 },
  { name: 'fotoTagging', maxCount: 1 },
  { name: 'sertifikat', maxCount: 1 },
  { name: 'laporanPemeriksaan', maxCount: 1 },
];

const OBJEK_MULTIPART_SCHEMA = {
  schema: {
    type: 'object',
    properties: {
      perusahaan:              { type: 'string', example: 'QMB' },
      kategori:                { type: 'string', example: 'APAR' },
      namaAlat:                { type: 'string', example: 'APAR Dry Chemical 6kg' },
      noSeri:                  { type: 'string', example: 'QMB-APAR-001' },
      jumlah:                  { type: 'integer', example: 10 },
      departemenId:            { type: 'string', example: 'DEP-001' },
      lokasi:                  { type: 'string', example: 'Gudang B, Rak 5' },
      kapasitas:               { type: 'number', example: 6 },
      satuan:                  { type: 'string', example: 'kg' },
      tahunPemasangan:         { type: 'integer', example: 2024 },
      kondisiPemasangan:       { type: 'string', example: 'Baik' },
      statusKelayakan:         { type: 'string', example: 'LAYAK' },
      statusRiksaUji:          { type: 'string', example: 'SUDAH_RIKSA' },
      statusAman:              { type: 'string', example: 'AMAN' },
      tanggalPengujianPertama: { type: 'string', format: 'date', example: '2025-01-15' },
      tanggalPengujianBerkala: { type: 'string', format: 'date', example: '2026-01-15' },
      noSuket:                 { type: 'string', example: 'SKT-001' },
      tanggalRiksaUjiTerakhir: { type: 'string', format: 'date', example: '2025-01-10' },
      tanggalBerlaku:          { type: 'string', format: 'date', example: '2026-01-10' },
      jadwalRiksaUji:          { type: 'string', example: '6 bulan sekali' },
      lhu:                     { type: 'string', enum: ['ADA', 'TIDAK ADA'], example: 'ADA' },
      noLHU:                   { type: 'string', example: 'LHU-001' },
      catatan:                 { type: 'string', example: 'Alat dalam kondisi baik' },
      pengesahanGambar:        { type: 'string', format: 'binary' },
      fileLHU:                 { type: 'string', format: 'binary' },
      fotoAlat:                { type: 'string', format: 'binary' },
      fotoTagging:             { type: 'string', format: 'binary' },
      sertifikat:              { type: 'string', format: 'binary' },
      laporanPemeriksaan:      { type: 'string', format: 'binary' },
    },
  },
};

/** Resolve an uploaded file to its public URL path */
function fileUrl(files: UploadedObjekFiles, key: keyof UploadedObjekFiles): string | undefined {
  const f = files?.[key]?.[0];
  return f ? `/uploads/objek-k3/${(f as any).filename}` : undefined;
}

@ApiTags('Objek K3')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/objek-k3')
export class ObjekK3Controller {
  constructor(private readonly service: ObjekK3Service) {}

  // ── GET all ───────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all Objek K3 (with optional filters)' })
  @ApiQuery({ name: 'perusahaan',       required: false, type: 'string' })
  @ApiQuery({ name: 'kategori',         required: false, type: 'string' })
  @ApiQuery({ name: 'statusKelayakan',  required: false, type: 'string' })
  @ApiQuery({ name: 'statusRiksaUji',   required: false, type: 'string' })
  @ApiQuery({ name: 'statusAman',       required: false, type: 'string' })
  @ApiQuery({ name: 'search',           required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'List of Objek K3' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('perusahaan')      perusahaan?: string,
    @Query('kategori')        kategori?: string,
    @Query('statusKelayakan') statusKelayakan?: string,
    @Query('statusRiksaUji')  statusRiksaUji?: string,
    @Query('statusAman')      statusAman?: string,
    @Query('search')          search?: string,
  ) {
    return this.service.findAll({ perusahaan, kategori, statusKelayakan, statusRiksaUji, statusAman, search });
  }

  // ── GET one ───────────────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Get one Objek K3 by ID' })
  @ApiParam({ name: 'id', description: 'Objek K3 ID' })
  @ApiResponse({ status: 200, description: 'Objek K3 detail' })
  @ApiResponse({ status: 404, description: 'Objek K3 not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ── POST create ───────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create Objek K3 with optional file uploads (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(OBJEK_MULTIPART_SCHEMA)
  @ApiResponse({ status: 201, description: 'Objek K3 created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileFieldsInterceptor(FILE_FIELDS_OBJEK, { storage: makeStorage(), fileFilter, limits: LIMIT }))
  create(
    @Request() req,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: UploadedObjekFiles,
  ) {
    const dto = this.parseBody(body, files);
    return this.service.create(req.user.id, dto as any);
  }

  // ── PUT update ────────────────────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Update Objek K3 with optional file uploads (multipart/form-data)' })
  @ApiParam({ name: 'id', description: 'Objek K3 ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(OBJEK_MULTIPART_SCHEMA)
  @ApiResponse({ status: 200, description: 'Objek K3 updated successfully' })
  @ApiResponse({ status: 404, description: 'Objek K3 not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(FileFieldsInterceptor(FILE_FIELDS_OBJEK, { storage: makeStorage(), fileFilter, limits: LIMIT }))
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: UploadedObjekFiles,
  ) {
    const dto = this.parseBody(body, files);
    return this.service.update(id, req.user.id, dto as any);
  }

  // ── DELETE ────────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Objek K3 (admin only)' })
  @ApiParam({ name: 'id', description: 'Objek K3 ID' })
  @ApiResponse({ status: 200, description: 'Objek K3 deleted successfully' })
  @ApiResponse({ status: 404, description: 'Objek K3 not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }

  // ── Riwayat Pemeriksaan ───────────────────────────────────────────────────

  @Post(':id/riwayat')
  @ApiOperation({ summary: 'Add riwayat pemeriksaan to Objek K3' })
  @ApiParam({ name: 'id', description: 'Objek K3 ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tanggal:     { type: 'string', format: 'date', example: '2026-10-15' },
        hasil:       { type: 'string', enum: ['LAYAK', 'TIDAK LAYAK', 'PERLU PERBAIKAN'], example: 'LAYAK' },
        catatan:     { type: 'string', example: 'Alat dalam kondisi baik' },
        fileLaporan: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Riwayat added successfully' })
  @ApiResponse({ status: 404, description: 'Objek K3 not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'fileLaporan', maxCount: 1 }], { storage: makeStorage(), fileFilter, limits: LIMIT }),
  )
  addRiwayat(
    @Param('id') objekK3Id: string,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: { fileLaporan?: Express.Multer.File[] },
  ) {
    const fileLaporan = files?.fileLaporan?.[0]
      ? `/uploads/objek-k3/${(files.fileLaporan[0] as any).filename}`
      : undefined;

    const dto: CreateRiwayatDto = {
      tanggal:     body.tanggal,
      hasil:       body.hasil,
      catatan:     body.catatan,
      fileLaporan,
    };
    return this.service.addRiwayat(objekK3Id, dto);
  }

  @Delete('riwayat/:riwayatId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete riwayat pemeriksaan (admin only)' })
  @ApiParam({ name: 'riwayatId', description: 'Riwayat ID' })
  @ApiResponse({ status: 200, description: 'Riwayat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Riwayat not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeRiwayat(@Param('riwayatId') riwayatId: string, @Request() req) {
    return this.service.removeRiwayat(riwayatId, req.user.id);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private parseBody(body: Record<string, string>, files: UploadedObjekFiles): UpdateObjekK3Dto {
    const n = (v?: string) => (v !== undefined && v !== '' ? Number(v) : undefined);

    return {
      perusahaan:              body.perusahaan as any,
      kategori:                body.kategori as any,
      namaAlat:                body.namaAlat,
      noSeri:                  body.noSeri,
      jumlah:                  body.jumlah ? Number(body.jumlah) : undefined,
      departemenId:            body.departemenId,
      lokasi:                  body.lokasi,
      kapasitas:               n(body.kapasitas),
      satuan:                  body.satuan  || undefined,
      tahunPemasangan:         n(body.tahunPemasangan),
      kondisiPemasangan:       body.kondisiPemasangan       || undefined,
      statusKelayakan:         body.statusKelayakan         as any || undefined,
      statusRiksaUji:          body.statusRiksaUji          as any || undefined,
      statusAman:              body.statusAman              as any || undefined,
      noSuket:                 body.noSuket                 || undefined,
      tanggalPengujianPertama: body.tanggalPengujianPertama || undefined,
      tanggalPengujianBerkala: body.tanggalPengujianBerkala || undefined,
      tanggalRiksaUjiTerakhir: body.tanggalRiksaUjiTerakhir || undefined,
      tanggalBerlaku:          body.tanggalBerlaku          || undefined,
      jadwalRiksaUji:          body.jadwalRiksaUji          || undefined,
      lhu:                     body.lhu                     || undefined,
      lhuAda:                  body.lhuAda                  || undefined,
      noLHU:                   body.noLHU                   || undefined,
      catatan:                 body.catatan                 || undefined,
      // File URLs resolved from uploads
      pengesahanGambar:   fileUrl(files, 'pengesahanGambar'),
      fileLHU:            fileUrl(files, 'fileLHU'),
      fotoAlat:           fileUrl(files, 'fotoAlat'),
      fotoTagging:        fileUrl(files, 'fotoTagging'),
      sertifikat:         fileUrl(files, 'sertifikat'),
      laporanPemeriksaan: fileUrl(files, 'laporanPemeriksaan'),
    };
  }
}
