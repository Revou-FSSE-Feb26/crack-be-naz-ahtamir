# SMK3 Backend API

Backend API untuk sistem SMK3 menggunakan NestJS + PostgreSQL dengan **Flexible Schema Strategy**.

## 🚀 Features

- **Flexible JSONB Schema** - Frontend dapat add/remove fields tanpa backend changes
- **TypeORM + PostgreSQL** - Modern ORM dengan relational database
- **Auto-sync** - Development mode otomatis sync database schema
- **Soft Delete** - Data tidak langsung terhapus permanen
- **CORS Enabled** - Ready untuk frontend integration
- **Docker Support** - PostgreSQL + pgAdmin sudah di-configure

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── smk3-data/          # Main SMK3 data module
│   │   │   ├── entities/
│   │   │   │   └── smk3-data.entity.ts
│   │   │   ├── smk3-data.controller.ts
│   │   │   ├── smk3-data.service.ts
│   │   │   └── smk3-data.module.ts
│   │   ├── auth/               # TODO: Auth module
│   │   ├── users/              # TODO: Users module
│   │   └── uploads/            # TODO: Uploads module
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── package.json
└── .env.example
```

## 🔧 Setup

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

### 3. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

PostgreSQL akan running di:
- **Database**: `postgresql://smk3_user:smk3_password@localhost:5432/smk3_db`
- **pgAdmin**: http://localhost:5050 (admin@smk3.local / admin)

### 4. Start Backend

```bash
bun run dev
```

Backend API akan running di: **http://localhost:3001/api**

## 📡 API Endpoints

### SMK3 Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/smk3-data` | Get all records (with filters) |
| `GET` | `/api/smk3-data/:id` | Get single record |
| `POST` | `/api/smk3-data` | Create new record |
| `PUT` | `/api/smk3-data` | Update record |
| `PATCH` | `/api/smk3-data` | Approve/close finding |
| `DELETE` | `/api/smk3-data?id=xxx` | Delete record |

### Query Parameters (GET)

- `subSubElementId` - Filter by sub-sub element
- `findingStatus` - Filter by status (OPEN, INPG, CLSD)
- `createdById` - Filter by creator

### Example Requests

#### Create Record
```bash
POST /api/smk3-data
Content-Type: application/json

{
  "subSubElementId": "7.1.1-inspeksi-ketidaksesuaian",
  "title": "Hazard di Area Produksi",
  "findingStatus": "OPEN",
  "createdBy": "John Doe",
  "createdById": "12345",
  "data": {
    "tanggalInspeksi": "2026-07-14",
    "lokasiUtama": "Area Produksi",
    "kategoriHazard": "10",
    "levelHazard": "High",
    "deskripsiKetidaksesuaian": "Tidak ada safety sign",
    "rekomendasiPerbaikan": "Pasang safety sign"
  },
  "files": [
    {
      "fieldName": "dokumentasiHazard",
      "fileName": "hazard.jpg",
      "fileUrl": "/uploads/hazard.jpg"
    }
  ]
}
```

#### Update Record
```bash
PUT /api/smk3-data
Content-Type: application/json

{
  "id": "uuid-here",
  "findingStatus": "INPG",
  "data": {
    "statusPerbaikan": "Dalam Proses"
  }
}
```

#### Approve (Close) Finding
```bash
PATCH /api/smk3-data
Content-Type: application/json

{
  "id": "uuid-here",
  "action": "approve"
}
```

## 🎯 Flexible Schema Benefits

### ✅ Frontend bisa add field baru tanpa backend update

**Frontend:**
```typescript
// Tambah field baru di formConfigs.ts
const fields = [
  ...existingFields,
  {
    name: "newField",
    type: "text",
    label: "New Field",
  }
];
```

**Backend:** ✅ Tidak perlu update - field akan tersimpan di `data` JSONB otomatis

### ✅ Frontend bisa rename field

**Frontend:**
```typescript
// Rename field dari "kategori" → "kategoriRisiko"
data: {
  kategoriRisiko: value
}
```

**Backend:** ✅ Tidak perlu update - tetap tersimpan di `data` JSONB

### ✅ Validation di frontend dulu

Saat development, validation di frontend. Nanti saat stable, baru add backend validation.

## 🔄 Database Schema

### Main Table: `smk3_data`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `subSubElementId` | VARCHAR | Sub-sub element identifier (indexed) |
| `title` | VARCHAR | Record title |
| `findingStatus` | ENUM | OPEN, INPG, CLSD (indexed) |
| `data` | **JSONB** | **Flexible data - any fields** |
| `files` | JSONB | Array of file objects |
| `createdBy` | VARCHAR | Creator name |
| `createdById` | VARCHAR | Creator ID (indexed) |
| `createdAt` | TIMESTAMP | Created timestamp |
| `updatedAt` | TIMESTAMP | Updated timestamp |
| `deletedAt` | TIMESTAMP | Soft delete timestamp |

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

## 📊 Database Management

### pgAdmin Access
1. Open http://localhost:5050
2. Login: `admin@smk3.local` / `admin`
3. Add server:
   - Host: `postgres` (or `localhost` if outside Docker)
   - Port: `5432`
   - Database: `smk3_db`
   - Username: `smk3_user`
   - Password: `smk3_password`

### Direct PostgreSQL Access
```bash
docker exec -it smk3_postgres psql -U smk3_user -d smk3_db
```

## 🔒 TODO: Security

- [ ] Implement JWT authentication
- [ ] Add role-based access control (RBAC)
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Implement file upload security
- [ ] Add audit logging

## 📝 Migration Path

### Phase 1 (Current): Flexible Development
- Accept any fields in JSONB
- Minimal validation
- Fast iteration

### Phase 2 (Future): Strict Validation
- Add DTO validation
- Enforce schema rules
- Add comprehensive error messages

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
DATABASE_HOST=your-production-db.com
DATABASE_SSL=true
JWT_SECRET=super-secure-key
```

### Build for Production
```bash
bun run build
bun run start:prod
```

## 🤝 Frontend Integration

Update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
BACKEND_API_URL=http://localhost:3001
```

Frontend dapat langsung use:
```typescript
import { api } from "@/lib/api";

const { data } = await api.get("/api/smk3-data");
```

## 📧 Support

Contact: NAZ Ahtamir
