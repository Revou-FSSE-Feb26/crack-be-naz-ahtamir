import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DocumentsService, documentDiskStorage, documentFileFilter } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';

// ── Swagger multipart body schema ─────────────────────────────────────────

const MULTIPART_SCHEMA = {
  schema: {
    type: 'object',
    required: [
      'departemenId', 'jenisDokumen', 'namaDokumen', 'nomorDokumen',
      'tanggalTerbit', 'statusDokumen', 'statusDistribusi', 'statusValidasi',
    ],
    properties: {
      departemenId:     { type: 'string', example: 'uuid-departemen' },
      jenisDokumen:     { type: 'string', enum: ['MANUAL', 'SOP', 'INSTRUKSI_KERJA', 'FORMULIR'] },
      namaDokumen:      { type: 'string', example: 'SOP Penanganan Limbah B3' },
      nomorDokumen:     { type: 'string', example: 'SOP-HSE-001' },
      revisi:           { type: 'string', example: '00' },
      tanggalTerbit:    { type: 'string', format: 'date', example: '2025-01-15' },
      statusDokumen:    { type: 'string', enum: ['ASLI', 'SALINAN', 'ASLI_REVISI', 'SALINAN_REVISI'] },
      statusDistribusi: { type: 'string', enum: ['TERKENDALI', 'TIDAK_TERKENDALI'] },
      statusValidasi:   { type: 'string', enum: ['BERLAKU', 'TIDAK_BERLAKU', 'PEMUSNAHAN'] },
      parentId:         { type: 'string', description: 'Opsional — UUID dokumen parent' },
      file: {
        type: 'string',
        format: 'binary',
        description: 'File dokumen (PDF/Word, maks. 10 MB) — opsional',
      },
    },
  },
};

@ApiTags('Master List Documents')
@ApiBearerAuth()
@Controller('api/documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly svc: DocumentsService) {}

  // ── GET /api/documents ────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List semua dokumen (flat)',
    description: 'Kembalikan flat array, dapat difilter by departemenId dan/atau jenisDokumen.',
  })
  @ApiQuery({ name: 'departemenId', required: false, description: 'UUID departemen' })
  @ApiQuery({ name: 'jenisDokumen', required: false, enum: ['MANUAL', 'SOP', 'INSTRUKSI_KERJA', 'FORMULIR'] })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  findAll(
    @Query('departemenId') departemenId?: string,
    @Query('jenisDokumen') jenisDokumen?: string,
  ) {
    return this.svc.findAll({ departemenId, jenisDokumen });
  }

  // ── GET /api/documents/tree ───────────────────────────────────────────────

  @Get('tree')
  @ApiOperation({
    summary: 'List dokumen sebagai nested tree',
    description: 'Sama seperti list flat tetapi sudah tersusun hierarki parent→children.',
  })
  @ApiQuery({ name: 'departemenId', required: false, description: 'Filter per departemen' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  findTree(@Query('departemenId') departemenId?: string) {
    return this.svc.findTree(departemenId);
  }

  // ── GET /api/documents/stats ──────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Statistik dokumen — total, per jenis, per status, per departemen' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  getStats() {
    return this.svc.getStats();
  }

  // ── GET /api/documents/:id ────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({ summary: 'Detail satu dokumen beserta children langsung' })
  @ApiParam({ name: 'id', description: 'UUID dokumen' })
  @ApiResponse({ status: 200, description: 'Berhasil' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  // ── POST /api/documents (JSON) ────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Tambah dokumen baru (JSON, tanpa file)' })
  @ApiResponse({ status: 201, description: 'Berhasil dibuat' })
  create(@Body() dto: CreateDocumentDto, @Request() req: any) {
    return this.svc.create(dto, req.user.id);
  }

  // ── POST /api/documents/with-file (multipart) ─────────────────────────────

  @Post('with-file')
  @ApiOperation({ summary: 'Tambah dokumen + upload file PDF/Word (opsional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(MULTIPART_SCHEMA)
  @ApiResponse({ status: 201, description: 'Berhasil dibuat' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: documentDiskStorage,
      fileFilter: documentFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  createWithFile(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('departemenId')     departemenId: string,
    @Body('jenisDokumen')     jenisDokumen: string,
    @Body('namaDokumen')      namaDokumen: string,
    @Body('nomorDokumen')     nomorDokumen: string,
    @Body('revisi')           revisi: string,
    @Body('tanggalTerbit')    tanggalTerbit: string,
    @Body('statusDokumen')    statusDokumen: string,
    @Body('statusDistribusi') statusDistribusi: string,
    @Body('statusValidasi')   statusValidasi: string,
    @Body('parentId')         parentId: string,
    @Request() req: any,
  ) {
    const fileUrl = file?.filename ? `/uploads/documents/${file.filename}` : undefined;
    return this.svc.create(
      {
        departemenId,
        jenisDokumen:     jenisDokumen as any,
        namaDokumen,
        nomorDokumen,
        revisi,
        tanggalTerbit,
        statusDokumen:    statusDokumen as any,
        statusDistribusi: statusDistribusi as any,
        statusValidasi:   statusValidasi as any,
        parentId:         parentId || undefined,
      },
      req.user.id,
      fileUrl,
    );
  }

  // ── PUT /api/documents/:id (JSON) ─────────────────────────────────────────

  @Put(':id')
  @ApiOperation({ summary: 'Update dokumen (JSON, tanpa file)' })
  @ApiParam({ name: 'id', description: 'UUID dokumen' })
  @ApiResponse({ status: 200, description: 'Berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateDocumentDto>,
  ) {
    return this.svc.update(id, dto);
  }

  // ── PUT /api/documents/with-file/:id (multipart) ──────────────────────────

  @Put('with-file/:id')
  @ApiOperation({ summary: 'Update dokumen + ganti file (opsional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(MULTIPART_SCHEMA)
  @ApiParam({ name: 'id', description: 'UUID dokumen' })
  @ApiResponse({ status: 200, description: 'Berhasil diperbarui' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: documentDiskStorage,
      fileFilter: documentFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  updateWithFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('departemenId')     departemenId: string,
    @Body('jenisDokumen')     jenisDokumen: string,
    @Body('namaDokumen')      namaDokumen: string,
    @Body('nomorDokumen')     nomorDokumen: string,
    @Body('revisi')           revisi: string,
    @Body('tanggalTerbit')    tanggalTerbit: string,
    @Body('statusDokumen')    statusDokumen: string,
    @Body('statusDistribusi') statusDistribusi: string,
    @Body('statusValidasi')   statusValidasi: string,
    @Body('parentId')         parentId: string,
  ) {
    const fileUrl = file?.filename ? `/uploads/documents/${file.filename}` : undefined;
    const dto: Partial<CreateDocumentDto> = {};
    if (departemenId)     dto.departemenId     = departemenId;
    if (jenisDokumen)     dto.jenisDokumen     = jenisDokumen as any;
    if (namaDokumen)      dto.namaDokumen      = namaDokumen;
    if (nomorDokumen)     dto.nomorDokumen     = nomorDokumen;
    if (revisi)           dto.revisi           = revisi;
    if (tanggalTerbit)    dto.tanggalTerbit    = tanggalTerbit;
    if (statusDokumen)    dto.statusDokumen    = statusDokumen as any;
    if (statusDistribusi) dto.statusDistribusi = statusDistribusi as any;
    if (statusValidasi)   dto.statusValidasi   = statusValidasi as any;
    if (parentId !== undefined) dto.parentId   = parentId || undefined;
    return this.svc.update(id, dto, fileUrl);
  }

  // ── DELETE /api/documents/:id ─────────────────────────────────────────────

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus dokumen (children kehilangan parent, tidak ikut terhapus)' })
  @ApiParam({ name: 'id', description: 'UUID dokumen' })
  @ApiResponse({ status: 200, description: 'Berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
