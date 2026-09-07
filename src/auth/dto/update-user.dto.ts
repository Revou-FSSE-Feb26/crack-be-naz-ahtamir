import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  jabatan?: string;

  @IsOptional()
  @IsString()
  departemen?: string;

  @IsOptional()
  @IsString()
  divisi?: string;

  @IsOptional()
  @IsString()
  pusat?: string;

  @IsOptional()
  @IsString()
  perusahaan?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ForgotPasswordDto {
  @IsString()
  idKaryawan: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
