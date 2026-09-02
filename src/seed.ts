import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  // Check if users already exist
  const existingUsers = await prisma.user.findMany();
  if (existingUsers.length > 0) {
    console.log('❌ Users already exist, skipping seed');
    await app.close();
    return;
  }

  const users = [
    {
      idKaryawan: '82400944',
      nama: 'Admin User',
      jabatan: 'Administrator',
      departemen: 'IT',
      divisi: 'Technology',
      pusat: 'Head Office',
      perusahaan: 'PT SMK3',
      password: '82400944K3',
      role: 'admin' as const,
      approved: true,
    },
    {
      idKaryawan: 'SUP001',
      nama: 'Supervisor User',
      jabatan: 'Supervisor Safety',
      departemen: 'K3',
      divisi: 'Safety',
      pusat: 'Head Office',
      perusahaan: 'PT SMK3',
      password: 'SUP001K3',
      role: 'supervisor' as const,
      approved: true,
    },
    {
      idKaryawan: 'USR001',
      nama: 'Regular User',
      jabatan: 'Staff',
      departemen: 'Production',
      divisi: 'Operations',
      pusat: 'Factory A',
      perusahaan: 'PT SMK3',
      password: 'USR001K3',
      role: 'user' as const,
      approved: true,
    },
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    console.log(`✅ Created user: ${userData.idKaryawan} - ${userData.nama}`);
  }

  console.log('✅ Seed completed!');
  await app.close();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
