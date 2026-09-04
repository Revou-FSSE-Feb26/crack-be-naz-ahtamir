import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import {
  Perusahaan,
  KategoriObjek,
  StatusKelayakan,
  StatusRiksaUji,
  StatusAman,
} from '@prisma/client';

export class CreateObjekK3Dto {
  @IsEnum(Perusahaan)
  perusahaan: Perusahaan;

  @IsEnum(KategoriObjek)
  kategori: KategoriObjek;

  @IsString()
  @IsNotEmpty()
  namaAlat: string;

  @IsString()
  @IsNotEmpty()
  noSeri: string;

  @IsInt()
  @Min(1)
  jumlah: number;

  @IsString()
  @IsNotEmpty()
  departemenId: string;

  @IsString()
  @IsNotEmpty()
  lokasi: string;

  @IsNumber()
  @IsOptional()
  kapasitas?: number;

  @IsString()
  @IsOptional()
  satuan?: string;

  @IsInt()
  @IsOptional()
  tahunPemasangan?: number;

  @IsString()
  @IsOptional()
  kondisiPemasangan?: string;

  // File URLs (resolved after upload)
  @IsString()
  @IsOptional()
  pengesahanGambar?: string;

  @IsString()
  @IsOptional()
  tanggalPengujianPertama?: string;

  @IsString()
  @IsOptional()
  tanggalPengujianBerkala?: string;

  @IsEnum(StatusKelayakan)
  @IsOptional()
  statusKelayakan?: StatusKelayakan;

  @IsEnum(StatusRiksaUji)
  @IsOptional()
  statusRiksaUji?: StatusRiksaUji;

  @IsString()
  @IsOptional()
  noSuket?: string;

  @IsString()
  @IsOptional()
  tanggalRiksaUjiTerakhir?: string;

  @IsString()
  @IsOptional()
  tanggalBerlaku?: string;

  @IsEnum(StatusAman)
  @IsOptional()
  statusAman?: StatusAman;

  @IsString()
  @IsOptional()
  jadwalRiksaUji?: string;

  @IsString()
  @IsOptional()
  lhu?: string; // ADA / TIDAK ADA

  @IsString()
  @IsOptional()
  fileLHU?: string;

  @IsString()
  @IsOptional()
  lhuAda?: string;

  @IsString()
  @IsOptional()
  noLHU?: string;

  @IsString()
  @IsOptional()
  fotoAlat?: string;

  @IsString()
  @IsOptional()
  fotoTagging?: string;

  @IsString()
  @IsOptional()
  sertifikat?: string;

  @IsString()
  @IsOptional()
  laporanPemeriksaan?: string;

  @IsString()
  @IsOptional()
  catatan?: string;
}
