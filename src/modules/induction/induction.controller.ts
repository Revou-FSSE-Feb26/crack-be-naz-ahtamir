import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { InductionService } from './induction.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { AddParticipantDto } from './dto/add-participant.dto';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

const mediaStorage = diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + extname(file.originalname));
  },
});

// ── Session routes (/api/induction) ──────────────────────────────────────────

@Controller('api/induction')
@UseGuards(JwtAuthGuard)
export class InductionController {
  constructor(private readonly svc: InductionService) {}

  // POST /api/induction
  @Post()
  createSession(@Body() dto: CreateSessionDto) {
    return this.svc.createSession(dto);
  }

  // GET /api/induction?status=ACTIVE
  @Get()
  findAll(@Query('status') status?: string) {
    return this.svc.findAllSessions(status);
  }

  // GET /api/induction/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findSessionById(id);
  }

  // PUT /api/induction/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateSessionDto> & { status?: string }) {
    return this.svc.updateSession(id, dto);
  }

  // DELETE /api/induction/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.svc.deleteSession(id);
    return { message: 'Sesi berhasil dihapus' };
  }

  // ── Participants ────────────────────────────────────────────────────────

  // GET /api/induction/check-duplicate?identitas=xxx
  @Get('check-duplicate')
  checkDuplicate(@Query('identitas') identitas: string) {
    return this.svc.checkDuplicate(identitas);
  }

  // POST /api/induction/:id/participants
  @Post(':id/participants')
  addParticipant(@Param('id') id: string, @Body() dto: AddParticipantDto) {
    return this.svc.addParticipant(id, dto);
  }

  // PATCH /api/induction/participants/:pid/status
  @Patch('participants/:pid/status')
  updateStatus(
    @Param('pid') pid: string,
    @Body('statusHadir') statusHadir: string,
  ) {
    return this.svc.updateParticipantStatus(pid, statusHadir);
  }

  // DELETE /api/induction/participants/:pid
  @Delete('participants/:pid')
  async removeParticipant(@Param('pid') pid: string) {
    await this.svc.removeParticipant(pid);
    return { message: 'Peserta dihapus' };
  }

  // GET /api/induction/card/:cardCode
  @Get('card/:cardCode')
  getCard(@Param('cardCode') cardCode: string) {
    return this.svc.getParticipantByCardCode(cardCode);
  }

  // ── Media ──────────────────────────────────────────────────────────────

  // POST /api/induction/:id/media
  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file', { storage: mediaStorage }))
  async uploadMedia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('File wajib disertakan');
    return this.svc.addMedia(
      id,
      type ?? 'FOTO_KEGIATAN',
      `/uploads/${file.filename}`,
      file.originalname,
      file.size,
      file.mimetype,
      req.user.id,
    );
  }

  // DELETE /api/induction/media/:mediaId
  @Delete('media/:mediaId')
  async removeMedia(@Param('mediaId') mediaId: string) {
    await this.svc.removeMedia(mediaId);
    return { message: 'Media dihapus' };
  }
}

// ── Public route (scan QR) — no JWT ─────────────────────────────────────────

@Controller('api/induction-public')
export class InductionPublicController {
  constructor(private readonly svc: InductionService) {}

  // GET /api/induction-public/session/:kodeSesi
  @Get('session/:kodeSesi')
  getPublicSession(@Param('kodeSesi') kodeSesi: string) {
    return this.svc.findSessionByKode(kodeSesi);
  }

  // POST /api/induction-public/session/:kodeSesi/register
  @Post('session/:kodeSesi/register')
  selfRegister(
    @Param('kodeSesi') kodeSesi: string,
    @Body() dto: AddParticipantDto,
  ) {
    return this.svc.selfRegister(kodeSesi, dto);
  }

  // GET /api/induction-public/card/:cardCode  (verifikasi kartu)
  @Get('card/:cardCode')
  verifyCard(@Param('cardCode') cardCode: string) {
    return this.svc.getParticipantByCardCode(cardCode);
  }
}
