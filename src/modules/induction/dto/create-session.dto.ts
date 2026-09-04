import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  tanggal: string;

  @IsString()
  lokasi: string;

  @IsOptional()
  @IsString()
  topik?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  picId?: string;

  /** DRAFT | ACTIVE | COMPLETED */
  @IsOptional()
  @IsString()
  status?: string;
}
