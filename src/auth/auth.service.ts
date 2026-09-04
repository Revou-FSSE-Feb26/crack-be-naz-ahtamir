import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ── Hitung umur otomatis ──
  private hitungUmur(tanggalLahir: Date | null): number | null {
    if (!tanggalLahir) return null;
    return differenceInYears(new Date(), tanggalLahir);
  }

  // ── Hitung masa kerja otomatis ──
  private hitungMasaKerja(tanggalMulai: Date | null): string | null {
    if (!tanggalMulai) return null;
    const now = new Date();
    const years  = differenceInYears(now, tanggalMulai);
    const months = differenceInMonths(now, tanggalMulai) % 12;
    const days   = differenceInDays(now, tanggalMulai) % 30;
    return `${years} Tahun ${months} Bulan ${days} Hari`;
  }

  // ── Format user response ──
  private formatUser(user: any) {
    const { password, ...rest } = user;
    return {
      ...rest,
      umur:      this.hitungUmur(user.tanggalLahir),
      masaKerja: this.hitungMasaKerja(user.tanggalMulaiKerja),
    };
  }

  // ── Login pakai idKaryawan ──
  async login(idKaryawan: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { idKaryawan },
    });

    if (!user) {
      throw new UnauthorizedException('ID Karyawan atau password salah');
    }

    if (!user.approved) {
      throw new UnauthorizedException('Akun belum disetujui');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('ID Karyawan atau password salah');
    }

    const payload = {
      id:          user.id,
      idKaryawan:  user.idKaryawan,
      nama:        user.nama,
      role:        user.role,
      departemen:  user.departemen,
      supervisorId: user.supervisorId,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: this.formatUser(user),
      token,
    };
  }

  // ── Bulk create users dari Excel ──
  async bulkCreateUsers(usersData: any[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    const SUPERVISOR_KEYWORDS = [
      'wakil foreman', '副班长', 'foreman', '班长',
      'supervisor', 'manager', 'superintendent', 'kepala', 'head',
    ];
    const ADMIN_IDS = ['82400944'];

    for (const userData of usersData) {
      try {
        // Cek sudah ada atau belum
        const existing = await this.prisma.user.findUnique({
          where: { idKaryawan: userData.idKaryawan },
        });

        if (existing) {
          results.failed.push({
            idKaryawan: userData.idKaryawan,
            reason: 'User sudah ada',
          });
          continue;
        }

        // Tentukan role
        let role: 'admin' | 'supervisor' | 'user' = 'user';
        if (ADMIN_IDS.includes(userData.idKaryawan)) {
          role = 'admin';
        } else if (userData.jabatan) {
          const lower = userData.jabatan.toLowerCase();
          if (SUPERVISOR_KEYWORDS.some(k => lower.includes(k))) {
            role = 'supervisor';
          }
        }

        // Password: idKaryawan + K3
        const hashedPassword = await bcrypt.hash(
          `${userData.idKaryawan}K3`, 10
        );

        const user = await this.prisma.user.create({
          data: {
            idKaryawan:       userData.idKaryawan,
            nama:             userData.nama,
            jabatan:          userData.jabatan,
            departemen:       userData.departemen,
            divisi:           userData.divisi,
            pusat:            userData.pusat,
            perusahaan:       userData.perusahaan,
            tanggalLahir:     userData.tanggalLahir     ? new Date(userData.tanggalLahir)     : null,
            tempatLahir:      userData.tempatLahir      ?? null,
            tanggalMulaiKerja: userData.tanggalMulaiKerja ? new Date(userData.tanggalMulaiKerja) : null,
            agama:            userData.agama            ?? null,
            jenisKelamin:     userData.jenisKelamin     ?? null,
            pendidikan:       userData.pendidikan       ?? null,
            namaSekolah:      userData.namaSekolah      ?? null,
            jurusan:          userData.jurusan          ?? null,
            password:         hashedPassword,
            role,
            approved:         true,
          },
        });

        results.success.push({
          idKaryawan: user.idKaryawan,
          nama:       user.nama,
          role:       user.role,
        });
      } catch (err: any) {
        results.failed.push({
          idKaryawan: userData.idKaryawan,
          reason:     err.message,
        });
      }
    }

    return results;
  }

  // ── Assign supervisor ke user (admin only) ──
  async assignSupervisor(userId: string, supervisorId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data:  { supervisorId },
    });
  }

  // ── Get semua user (admin only) ──
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id:               true,
        idKaryawan:       true,
        nama:             true,
        jabatan:          true,
        departemen:       true,
        role:             true,
        supervisorId:     true,
        tanggalLahir:     true,
        tanggalMulaiKerja: true,
        approved:         true,
        createdAt:        true,
      },
      orderBy: { nama: 'asc' },
    });

    return users.map(u => ({
      ...u,
      umur:      this.hitungUmur(u.tanggalLahir),
      masaKerja: this.hitungMasaKerja(u.tanggalMulaiKerja),
    }));
  }

  // ── Lookup user by idKaryawan — untuk form license-certification ──
  async getUserByIdKaryawan(idKaryawan: string) {
    const user = await this.prisma.user.findUnique({
      where: { idKaryawan },
      select: {
        id:          true,
        idKaryawan:  true,
        nama:        true,
        jabatan:     true,
        departemen:  true,
        divisi:      true,
        perusahaan:  true,
      },
    });
    if (!user) return null;
    return user;
  }
}