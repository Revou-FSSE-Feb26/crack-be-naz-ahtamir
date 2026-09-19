# HAAMI Backend — Occupational Health and Safety (OHS) Management System

**HAAMI** — Hazard Analysis & Awareness Management Integrated

> Backend API for a comprehensive enterprise-grade Occupational Health and Safety (OHS) management system, built to streamline hazard identification, risk assessment, compliance tracking, safety training, emergency preparedness, and incident investigation.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [ERD](#erd)
- [Installation & Usage](#installation--usage)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [API Modules](#api-modules)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Project Description

HAAMI (Hazard Analysis & Awareness Management Integrated) is the backend API server for a full-stack OHS management platform designed for industrial and enterprise environments.

The system digitizes and centralizes all safety operations — from hazard reporting and risk assessment to incident investigation, compliance tracking, and employee safety induction. It supports multi-role access (Admin, Supervisor, User) with a supervisor-subordinate hierarchy, enabling structured approval workflows and real-time safety monitoring across departments.

**Core capabilities:**
- Systematic hazard identification and multi-level risk scoring
- Complete finding lifecycle — report → review → approve/reject → close
- Equipment registry with inspection scheduling and automated license expiry alerts
- Safety induction sessions with QR code-based attendance
- Emergency drill planning and documentation
- Incident investigation with root cause analysis and corrective action tracking
- Policy and document management with acknowledgment/signature tracking
- Real-time notification system with scheduled reminders
- Full audit trail on all system actions

---

## Features

| Feature | Description |
|---|---|
| **Authentication & Authorization** | JWT-based auth with role-based access control (Admin, Supervisor, User) |
| **User Management** | Employee profiles, role assignment, supervisor hierarchy, activate/deactivate |
| **Finding Management** | Safety finding reports with photo attachments, approval workflow, and deadline tracking |
| **Department Management** | Organizational structure with department codes |
| **Document Control** | Master document list with revision tracking and hierarchical tree view |
| **K3 Policy Management** | Policy documents with file upload and digital signature tracking |
| **Equipment Registry (Objek K3)** | Track safety equipment with inspection scheduling and license expiry |
| **Equipment Inspection History** | Inspection records with status monitoring and overdue alerts |
| **Emergency Drills** | Plan, schedule, execute, and document emergency response drills |
| **Safety Induction** | Manage induction sessions with QR code attendance scanning |
| **Incident Investigation** | Document incidents with root cause analysis, corrective actions, and sign-off |
| **Notifications** | Real-time in-app notifications for findings, approvals, and deadlines |
| **Automated Reminders** | Scheduled jobs for deadline reminders and license expiration alerts |
| **Audit Logging** | Complete change history with user action records |
| **File Uploads** | Multi-file upload support for findings, policies, investigations, and equipment |
| **Swagger API Docs** | Interactive API documentation at `/api/docs` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Framework** | NestJS |
| **Language** | TypeScript |
| **Database** | PostgreSQL (v14+) |
| **ORM** | Prisma |
| **Authentication** | JWT (JSON Web Tokens) via `@nestjs/jwt` & Passport |
| **API Documentation** | Swagger / OpenAPI 3.0 |
| **File Storage** | Local filesystem (`public/uploads`) |
| **Job Scheduling** | `@nestjs/schedule` |
| **Validation** | `class-validator` / `class-transformer` |
| **Testing** | Jest |

---

## Screenshots

> Screenshots dari aplikasi frontend HAAMI.

### Dashboard & Finding Management
![Dashboard](docs/screenshots/dashboard.png)

### Safety Induction & QR Attendance
![Induction](docs/screenshots/induction.png)

### Incident Investigation
![Investigation](docs/screenshots/investigation.png)

> **Note:** Tambahkan screenshot ke folder `docs/screenshots/` dengan nama file sesuai di atas, atau ganti path-nya dengan path yang sesuai.

---

## ERD

Entity Relationship Diagram dari database HAAMI:

![ERD](docs/ERD.png)

ERD mencakup semua entitas utama: User, Finding, Department, Document, K3Policy, ObjekK3, InspectionHistory, EmergencyDrill, Induction, Investigation, Notification, dan AuditLog.

---

## Installation & Usage

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- npm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crack-be-naz-ahtamir
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Buat file `.env` di root directory. Lihat bagian [Environment Configuration](#environment-configuration).

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed initial data**
   ```bash
   # Seed departments
   npm run seed

   # Import employee data from Excel template
   npm run import:karyawan
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

   Server akan berjalan di `http://localhost:3001`  
   Swagger UI tersedia di `http://localhost:3001/api/docs`

### Other Commands

```bash
# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug

# Unit tests
npm run test

# Test with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Generate employee import template
npm run generate:template
```

---

## Environment Configuration

Buat file `.env` di root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=smk3_db

# JWT
JWT_SECRET=<generate-a-secure-random-secret-min-64-chars>
JWT_EXPIRES_IN=30d

# Server
PORT=3001

# Prisma
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/smk3_db"
```

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | PostgreSQL server hostname | `localhost` |
| `DB_PORT` | PostgreSQL server port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres123` |
| `DB_DATABASE` | Database name | `smk3_db` |
| `JWT_SECRET` | Secret key for JWT signing | 64+ char random string |
| `JWT_EXPIRES_IN` | Token expiration | `30d`, `7d`, `1h` |
| `PORT` | App server port | `3001` |
| `DATABASE_URL` | Full Prisma connection string | `postgresql://user:pass@host:port/db` |

---

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## API Documentation

Swagger UI tersedia saat server berjalan:

**`http://localhost:3001/api/docs`**

Dokumentasi mencakup semua endpoint, request/response schema, autentikasi, dan contoh request.

Untuk testing via Postman, import file `SMK3_API_Postman_Collection.json` yang tersedia di root repository.

---

## Project Structure

```
crack-be-naz-ahtamir/
├── src/
│   ├── auth/                    # Authentication — JWT, guards, decorators
│   ├── common/                  # Shared filters, interceptors, pipes
│   ├── findings/                # Finding management module
│   ├── notifications/           # Notification system
│   ├── scheduler/               # Scheduled jobs (deadline & license reminders)
│   ├── prisma/                  # Prisma service
│   ├── modules/
│   │   ├── departments/         # Department management
│   │   ├── documents/           # Document control
│   │   ├── emergency-drill/     # Emergency drill management
│   │   ├── induction/           # Safety induction sessions
│   │   ├── investigation/       # Incident investigation
│   │   ├── k3-policy/           # K3 policy management
│   │   └── objek-k3/            # Equipment registry
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── migrations/              # Prisma migration files
│   └── schema.prisma            # Database schema
├── public/
│   └── uploads/                 # Uploaded files (statically served)
├── docs/
│   ├── ERD.png                  # Entity Relationship Diagram
│   └── smoke_test.md            # Smoke test documentation
├── scripts/                     # Utility scripts (seed, import)
├── test/                        # E2E tests
├── SMK3_API_Postman_Collection.json
├── .env
├── package.json
└── README.md
```

---

## API Modules

### Authentication — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/auth/users` | Get all users |
| GET | `/api/auth/users/:id` | Get user by UUID |
| GET | `/api/auth/users/by-id-karyawan/:id` | Get user by employee ID |
| PATCH | `/api/auth/users/:id` | Update user profile |
| PATCH | `/api/auth/users/:id/role` | Update user role |
| PATCH | `/api/auth/users/:id/supervisor` | Assign supervisor |
| PATCH | `/api/auth/users/:id/deactivate` | Deactivate user |
| PATCH | `/api/auth/users/:id/activate` | Activate user |
| POST | `/api/auth/me/change-password` | Change own password |

### Departments — `/api/departments`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/departments` | Get all departments |
| POST | `/api/departments` | Create department |
| GET | `/api/departments/:id` | Get department by ID |
| PUT | `/api/departments/:id` | Update department |
| DELETE | `/api/departments/:id` | Delete department |

### Findings — `/api/smk3-data`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/smk3-data` | Create finding |
| GET | `/api/smk3-data` | Get all findings (with filters) |
| GET | `/api/smk3-data/:id` | Get finding details |
| PUT | `/api/smk3-data/:id` | Update finding |
| PATCH | `/api/smk3-data/:id/status` | Approve / reject finding |
| DELETE | `/api/smk3-data/:id` | Soft delete finding |
| GET | `/api/smk3-data/deadline-reminders` | Get deadline reminders list |

### Notifications — `/api/notifications`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PATCH | `/api/notifications/read-all` | Mark all as read |
| PATCH | `/api/notifications/:id/read` | Mark single as read |
| POST | `/api/notifications` | Create notification (admin) |

### Documents — `/api/documents`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/documents` | Get all documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/tree` | Get hierarchical document tree |
| GET | `/api/documents/stats` | Get document statistics |
| GET | `/api/documents/:id` | Get document by ID |
| PUT | `/api/documents/:id` | Update document |
| DELETE | `/api/documents/:id` | Delete document |

### K3 Policy — `/api/k3-policy`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/k3-policy` | Get all policies |
| GET | `/api/k3-policy/:id` | Get policy by ID |
| POST | `/api/k3-policy/with-file` | Create policy with file upload |
| PUT | `/api/k3-policy/with-file/:id` | Update policy with file upload |
| DELETE | `/api/k3-policy/:id` | Delete policy |

### Equipment — `/api/objek-k3`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/objek-k3` | Get all equipment |
| POST | `/api/objek-k3` | Create equipment |
| GET | `/api/objek-k3/:id` | Get equipment by ID |
| PUT | `/api/objek-k3/:id` | Update equipment |
| DELETE | `/api/objek-k3/:id` | Delete equipment |
| GET | `/api/objek-k3/:id/riwayat` | Get inspection history |
| POST | `/api/objek-k3/:id/riwayat` | Add inspection record |

### Emergency Drill — `/api/emergency-drill`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/emergency-drill` | Get all drills |
| POST | `/api/emergency-drill` | Create drill |
| GET | `/api/emergency-drill/:id` | Get drill by ID |
| PUT | `/api/emergency-drill/:id` | Update drill |
| DELETE | `/api/emergency-drill/:id` | Delete drill |

### Safety Induction — `/api/induction`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/induction` | Get all sessions |
| POST | `/api/induction` | Create session |
| GET | `/api/induction/:id` | Get session by ID |
| PUT | `/api/induction/:id` | Update session |
| DELETE | `/api/induction/:id` | Delete session |
| POST | `/api/induction/:id/participants` | Add participant |
| GET | `/api/induction/:id/participants` | Get all participants |
| PATCH | `/api/induction/:id/participants/scan` | QR code attendance scan |
| POST | `/api/induction/:id/media` | Upload session media |
| GET | `/api/induction/:id/media` | Get session media |
| PATCH | `/api/induction/:id/close` | Close induction session |

### Investigation — `/api/investigations`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/investigations` | Get all investigations |
| POST | `/api/investigations` | Create investigation |
| GET | `/api/investigations/:id` | Get investigation by ID |
| PUT | `/api/investigations/:id` | Update investigation |
| PATCH | `/api/investigations/:id/status` | Update status |
| PATCH | `/api/investigations/:id/sign-approval` | Sign approval |
| GET | `/api/investigations/:id/logs` | Get investigation logs |

---

## Authentication

Semua endpoint (kecuali `/api/auth/login`) memerlukan JWT Bearer token.

```
Authorization: Bearer <your_jwt_token>
```

**Login flow:**
1. POST ke `/api/auth/login` dengan employee ID dan password
2. Response berisi `access_token` dan data user
3. Sertakan token di header `Authorization` pada setiap request berikutnya

Token berlaku selama 30 hari secara default (dapat dikonfigurasi via `JWT_EXPIRES_IN`).

---

## Deployment

| | Link |
|---|---|
| **Backend API** | https://haami-demo.onrender.com |
| **Frontend App** | https://your-frontend-deployment-url.com |
| **API Docs (Swagger)** | https://haami-demo.onrender.com/api/docs |

> Ganti link di atas dengan URL deployment yang sebenarnya.

### Production Checklist

1. Set `NODE_ENV=production` di environment
2. Gunakan `JWT_SECRET` yang kuat (minimal 64 karakter random)
3. Jalankan migrasi: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm run start:prod`

### Docker (Opsional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main"]
```

---

## Contact

**Project Maintainer:** Naz Ahtamir  
**Repository:** [Project Repository URL]

---

## License

This project is proprietary and confidential. Unauthorized distribution or reproduction is prohibited.
