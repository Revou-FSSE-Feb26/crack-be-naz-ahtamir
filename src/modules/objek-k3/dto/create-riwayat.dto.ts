import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRiwayatDto {
  @IsString()
  @IsNotEmpty()
  tanggal: string;

  @IsString()
  @IsNotEmpty()
  hasil: string; // LAYAK / TIDAK LAYAK / PERLU PERBAIKAN

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsString()
  @IsOptional()
  fileLaporan?: string;
}
