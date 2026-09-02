import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const dept = await this.prisma.department.findUnique({ where: { id } });
    if (!dept) throw new NotFoundException(`Departemen dengan id ${id} tidak ditemukan`);
    return dept;
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Kode departemen "${dto.code}" sudah dipakai`);
    return this.prisma.department.create({ data: { name: dto.name, code: dto.code } });
  }

  async update(id: string, dto: Partial<CreateDepartmentDto>) {
    await this.findOne(id);
    return this.prisma.department.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.department.delete({ where: { id } });
  }

  /**
   * Upsert bulk — idempotent, aman dipanggil berulang.
   * Insert jika code belum ada; skip jika sudah ada (tidak overwrite name).
   * Kembalikan summary: inserted, skipped, total.
   */
  async upsertMany(dtos: CreateDepartmentDto[]) {
    let inserted = 0;
    let skipped = 0;

    for (const dto of dtos) {
      const existing = await this.prisma.department.findUnique({ where: { code: dto.code } });
      if (existing) {
        skipped++;
      } else {
        await this.prisma.department.create({ data: { name: dto.name, code: dto.code } });
        inserted++;
      }
    }

    const all = await this.prisma.department.findMany({ orderBy: { name: 'asc' } });
    return { inserted, skipped, total: all.length, departments: all };
  }
}
