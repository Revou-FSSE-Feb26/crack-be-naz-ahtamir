import { IsString, IsOptional, IsEmail } from 'class-validator';

export class AddParticipantDto {
  /** Jika internal karyawan — userId saja sudah cukup */
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  perusahaan?: string;

  /** NIK / KTP / Paspor — untuk cek duplikat */
  @IsOptional()
  @IsString()
  identitas?: string;

  @IsOptional()
  @IsString()
  noTelp?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsString()
  jenisKelamin?: string;

  /** KARYAWAN_BARU | KONTRAKTOR | TAMU | SUPPLIER | MAGANG */
  @IsOptional()
  @IsString()
  tipe?: string;

  /** QR | MANUAL */
  @IsOptional()
  @IsString()
  scanMethod?: string;
}
