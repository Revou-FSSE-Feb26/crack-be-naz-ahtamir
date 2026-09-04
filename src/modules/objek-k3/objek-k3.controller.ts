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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ObjekK3Service } from './objek-k3.service';
import { UpdateObjekK3Dto } from './dto/update-objek-k3.dto';
import { CreateRiwayatDto } from './dto/create-riwayat.dto';

// Upload destination for objek-k3 files
const UPLOAD_DIR = join(process.cwd(), '..', 'public', 'uploads', 'objek-k3');

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

  // ── List (with filters) ───────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get all Objek K3 (with optional filters)' })
  findAll(
    @Query('perusahaan') perusahaan?: string,
    @Query('kategori') kategori?: string,
    @Query('statusKelayakan') statusKelayakan?: string,
    @Query('statusRiksaUji') statusRiksaUji?: string,
    @Query('statusAman') statusAman?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll({ perusahaan, kategori, statusKelayakan, statusRiksaUji, statusAman, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one Objek K3 by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ── Create (multipart/form-data) ──────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create Objek K3 with optional file uploads' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pengesahanGambar', maxCount: 1 },
        { name: 'fileLHU', maxCount: 1 },
        { name: 'fotoAlat', maxCount: 1 },
        { name: 'fotoTagging', maxCount: 1 },
        { name: 'sertifikat', maxCount: 1 },
        { name: 'laporanPemeriksaan', maxCount: 1 },
      ],
      { storage: makeStorage(), fileFilter, limits: LIMIT },
    ),
  )
  create(
    @Request() req,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: UploadedObjekFiles,
  ) {
    const dto = this.parseBody(body, files);
    return this.service.create(req.user.id, dto as any);
  }

  // ── Update (multipart/form-data) ──────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Update Objek K3 with optional file uploads' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pengesahanGambar', maxCount: 1 },
        { name: 'fileLHU', maxCount: 1 },
        { name: 'fotoAlat', maxCount: 1 },
        { name: 'fotoTagging', maxCount: 1 },
        { name: 'sertifikat', maxCount: 1 },
        { name: 'laporanPemeriksaan', maxCount: 1 },
      ],
      { storage: makeStorage(), fileFilter, limits: LIMIT },
    ),
  )
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() body: Record<string, string>,
    @UploadedFiles() files: UploadedObjekFiles,
  ) {
    const dto = this.parseBody(body, files);
    return this.service.update(id, req.user.id, dto as any);
  }

  // ── Delete ────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Objek K3 (admin only)' })
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.id);
  }

  // ── Riwayat Pemeriksaan ───────────────────────────────────────────────

  @Post(':id/riwayat')
  @ApiOperation({ summary: 'Add riwayat pemeriksaan to an Objek K3' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'fileLaporan', maxCount: 1 }],
      { storage: makeStorage(), fileFilter, limits: LIMIT },
    ),
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
      tanggal: body.tanggal,
      hasil: body.hasil,
      catatan: body.catatan,
      fileLaporan,
    };
    return this.service.addRiwayat(objekK3Id, dto);
  }

  @Delete('riwayat/:riwayatId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete riwayat pemeriksaan (admin only)' })
  removeRiwayat(@Param('riwayatId') riwayatId: string, @Request() req) {
    return this.service.removeRiwayat(riwayatId, req.user.id);
  }

  // ── Private helpers ───────────────────────────────────────────────────

  /** Convert raw multipart body strings + uploaded files into a DTO-like object */
  private parseBody(body: Record<string, string>, files: UploadedObjekFiles): UpdateObjekK3Dto {
    const n = (v?: string) => (v !== undefined && v !== '' ? Number(v) : undefined);

    return {
      perusahaan: body.perusahaan as any,
      kategori: body.kategori as any,
      namaAlat: body.namaAlat,
      noSeri: body.noSeri,
      jumlah: body.jumlah ? Number(body.jumlah) : undefined,
      departemenId: body.departemenId,
      lokasi: body.lokasi,
      kapasitas: n(body.kapasitas),
      satuan: body.satuan || undefined,
      tahunPemasangan: n(body.tahunPemasangan),
      kondisiPemasangan: body.kondisiPemasangan || undefined,
      // Files — new upload wins; keep existing if no new upload
      pengesahanGambar: fileUrl(files, 'pengesahanGambar') ?? body.pengesahanGambar || undefined,
      tanggalPengujianPertama: body.tanggalPengujianPertama || undefined,
      tanggalPengujianBerkala: body.tanggalPengujianBerkala || undefined,
      statusKelayakan: (body.statusKelayakan as any) || undefined,
      statusRiksaUji: (body.statusRiksaUji as any) || undefined,
      noSuket: body.noSuket || undefined,
      tanggalRiksaUjiTerakhir: body.tanggalRiksaUjiTerakhir || undefined,
      tanggalBerlaku: body.tanggalBerlaku || undefined,
      statusAman: (body.statusAman as any) || undefined,
      jadwalRiksaUji: body.jadwalRiksaUji || undefined,
      lhu: body.lhu || undefined,
      fileLHU: fileUrl(files, 'fileLHU') ?? body.fileLHU || undefined,
      lhuAda: body.lhuAda || undefined,
      noLHU: body.noLHU || undefined,
      fotoAlat: fileUrl(files, 'fotoAlat') ?? body.fotoAlat || undefined,
      fotoTagging: fileUrl(files, 'fotoTagging') ?? body.fotoTagging || undefined,
      sertifikat: fileUrl(files, 'sertifikat') ?? body.sertifikat || undefined,
      laporanPemeriksaan: fileUrl(files, 'laporanPemeriksaan') ?? body.laporanPemeriksaan || undefined,
      catatan: body.catatan || undefined,
    };
  }
}
