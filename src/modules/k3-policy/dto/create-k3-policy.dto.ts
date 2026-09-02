// src/modules/k3-policy/dto/create-k3-policy.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum JenisKebijakan {
  UMUM = 'UMUM',
  KHUSUS = 'KHUSUS',
}

export enum StatusDokumen {
  ASLI = 'ASLI',
  SALINAN = 'SALINAN',
  ASLI_REVISI = 'ASLI-REVISI',
  SALINAN_REVISI = 'SALINAN-REVISI',
}

export enum StatusDistribusi {
  TERKENDALI = 'TERKENDALI',
  TIDAK_TERKENDALI = 'TIDAK TERKENDALI',
}

export enum StatusValidasi {
  BERLAKU = 'BERLAKU',
  EDISI_LAMA = 'EDISI LAMA',
  BATALKAN = 'BATALKAN',
}

export class CreateK3PolicyDto {
  @ApiProperty({ enum: JenisKebijakan, example: 'UMUM' })
  @IsEnum(JenisKebijakan)
  @IsNotEmpty()
  jenisKebijakan: JenisKebijakan;

  @ApiProperty({ example: 'Kebijakan K3 PT QMB' })
  @IsString()
  @IsNotEmpty()
  judulKebijakan: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  @IsNotEmpty()
  tanggalPenetapan: string;

  @ApiProperty({ example: 'Zhou Yang' })
  @IsString()
  @IsNotEmpty()
  penandatangan: string;

  @ApiProperty({ example: 'Deputy Manager' })
  @IsString()
  @IsNotEmpty()
  jabatan: string;

  @ApiProperty({ enum: StatusDokumen, example: 'ASLI' })
  @IsEnum(StatusDokumen)
  @IsNotEmpty()
  statusDokumen: StatusDokumen;

  @ApiPropertyOptional({ enum: StatusDistribusi, example: 'TERKENDALI' })
  @IsEnum(StatusDistribusi)
  @IsOptional()
  statusDistribusi?: StatusDistribusi;

  @ApiPropertyOptional({ enum: StatusValidasi, example: 'BERLAKU' })
  @IsEnum(StatusValidasi)
  @IsOptional()
  statusValidasi?: StatusValidasi;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'File PDF' })
  @IsOptional()
  file?: any;
    fileUrl: any;
}