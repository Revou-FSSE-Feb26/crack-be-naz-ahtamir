# C.R.A.C.K Backend — SMK3 API Server

> **C**ompliance **R**isk **A**ssessment & **C**ontrol **K**nowledge  
> Backend NestJS untuk sistem manajemen K3 (Keselamatan dan Kesehatan Kerja)

Live Demo: [https://crack-fe-naz-ahtamir.vercel.app](https://crack-fe-naz-ahtamir.vercel.app/)

---

## Tech Stack

| Layer       | Teknologi                  |
|-------------|----------------------------|
| Framework   | NestJS (Node.js)           |
| Database    | PostgreSQL via Prisma ORM  |
| Auth        | JWT (JSON Web Token)       |
| Password    | bcrypt                     |
| Validation  | class-validator            |
| Runtime     | Bun / Node.js              |

---

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env  # lalu isi variabel DB & JWT

# Generate Prisma client
bunx prisma generate

# Jalankan migrasi database
bunx prisma migrate deploy

# Seed admin awal
node scripts/seed-admin.js

# Development mode
bun run start:dev
```

Server berjalan di `http://localhost:3001`

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crack_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

---

## API Endpoints

### Auth & User Management

| Method | Endpoint                               | Auth | Keterangan                              |
|--------|----------------------------------------|------|-----------------------------------------|
| POST   | `/api/auth/login`                      | ❌    | Login dengan idKaryawan & password      |
| GET    | `/api/auth/users`                      | ❌    | Get semua user                          |
| GET    | `/api/auth/users/:id`                  | ✅    | Get user by ID                          |
| GET    | `/api/auth/users/by-id-karyawan/:id`   | ✅    | Lookup user by idKaryawan               |
| POST   | `/api/auth/bulk-create-users`          | ❌    | Bulk create user dari Excel             |
| PATCH  | `/api/auth/users/:id`                  | ✅    | **[Task 2]** Update profil user         |
| PATCH  | `/api/auth/users/:id/deactivate`       | ✅    | **[Task 1]** Soft delete (approved=false) |
| PATCH  | `/api/auth/users/:id/activate`         | ✅    | Reaktivasi user (approved=true)         |
| PATCH  | `/api/auth/users/:userId/role`         | ✅    | Update role user (admin only)           |
| PATCH  | `/api/auth/users/:userId/supervisor`   | ❌    | Assign supervisor ke user               |
| POST   | `/api/auth/users/:id/change-password`  | ✅    | **[Task 4]** Ganti password sendiri     |
| POST   | `/api/auth/forgot-password`            | ❌    | **[Task 3]** Request token reset        |
| GET    | `/api/auth/reset-password/:token/validate` | ❌ | Validasi token reset                 |
| POST   | `/api/auth/reset-password`             | ❌    | **[Task 3]** Reset password via token   |

### Findings (Temuan K3)

| Method | Endpoint                               | Auth | Keterangan                              |
|--------|----------------------------------------|------|-----------------------------------------|
| GET    | `/api/findings`                        | ✅    | Get semua temuan                        |
| POST   | `/api/findings`                        | ✅    | Buat temuan baru                        |
| GET    | `/api/findings/:id`                    | ✅    | Get temuan by ID                        |
| PATCH  | `/api/findings/:id`                    | ✅    | Update temuan                           |
| POST   | `/api/findings/:id/approve`            | ✅    | Approve temuan (supervisor/admin)       |
| POST   | `/api/findings/:id/close`              | ✅    | Tutup temuan (CLSD)                     |

### Lainnya

- `GET /api/departments` — Daftar departemen
- `GET /api/documents` — Master list dokumen
- `GET /api/k3-policy` — Kebijakan K3
- `GET /api/objek-k3` — Inventaris objek K3
- `GET /api/induction` — Sesi Safety Induction
- `GET /api/notifications` — Notifikasi user

---

## User Management Enhancement (Task 1–4)

### Task 1 — Soft Delete

Alih-alih menghapus user secara permanen, gunakan `approved=false` untuk menonaktifkan akun. User yang dinonaktifkan tidak bisa login.

```http
PATCH /api/auth/users/:id/deactivate
Authorization: Bearer <token>
```

```http
PATCH /api/auth/users/:id/activate
Authorization: Bearer <token>
```

### Task 2 — Update Profil User

```http
PATCH /api/auth/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "Nama Baru",
  "jabatan": "Staff K3",
  "departemen": "Safety Department",
  "divisi": "HSE",
  "email": "user@company.com"
}
```

Field yang bisa diupdate: `nama`, `jabatan`, `departemen`, `divisi`, `pusat`, `perusahaan`, `email`.

### Task 3 — Forgot Password Flow

**Step 1:** Request token reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "idKaryawan": "82400469"
}
```

Response (development mode):
```json
{
  "message": "Token reset password berhasil dibuat. Berlaku 1 jam.",
  "resetToken": "abc123...",
  "resetUrl": "/reset-password?token=abc123..."
}
```

> Di production, token dikirim via email. Di development, token dikembalikan langsung di response.

**Step 2:** Reset password menggunakan token
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "passwordbaru123"
}
```

### Task 4 — Change Password

Untuk user yang sudah login dan ingin mengganti password:

```http
POST /api/auth/users/:id/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "passwordlama",
  "newPassword": "passwordbaru123"
}
```

---

## Default Password

Saat bulk import dari Excel, password default adalah: `{idKaryawan}K3`

Contoh: ID Karyawan `82400469` → password default `82400469K3`

---

## Role System

| Role       | Akses                                      |
|------------|--------------------------------------------|
| `admin`    | Full access — user management, semua data  |
| `supervisor` | Approve temuan, lihat data tim           |
| `user`     | Submit temuan, lihat data sendiri          |

---

## Database Schema

Model utama: `User`, `Finding`, `FindingFile`, `Notification`, `AuditLog`, `Department`, `Document`, `K3Policy`, `ObjekK3`, `InductionSession`, `InductionParticipant`

Lihat `prisma/schema.prisma` untuk detail lengkap.

---

## Scripts

```bash
node scripts/seed-admin.js          # Seed user admin
node scripts/seed-departments.js    # Seed departemen awal
node scripts/import-users-from-excel.js  # Import karyawan dari Excel
node scripts/seed-notifications.js  # Seed notifikasi test
```
