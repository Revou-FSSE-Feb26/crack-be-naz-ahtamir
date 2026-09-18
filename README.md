# HAAMI Backend — Occupational Health and Safety (OHS) Management System

**HAAMI** (Hazard Analysis & Awareness Management Integrated)

**Enterprise OHS Management System Backend API**

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Modules](#api-modules)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Overview

HAAMI (Hazard Analysis & Awareness Management Integrated) is the backend API server for a comprehensive Occupational Health and Safety (OHS) management system.

The system provides a unified platform for hazard identification, risk assessment, compliance management, safety training, emergency preparedness, and incident investigation across organizational operations.

HAAMI enables:
- **Hazard Analysis** - Systematic identification, assessment, and control of workplace hazards
- **Awareness Management** - Employee training, safety induction, and policy dissemination programs
- **Compliance Control** - Regulatory compliance tracking and audit-ready documentation
- **Incident Management** - Complete lifecycle tracking of safety findings, incidents, and investigations

---

## Architecture

**Framework:** NestJS (Node.js)  
**Database:** PostgreSQL  
**ORM:** Prisma  
**Authentication:** JWT (JSON Web Tokens)  
**API Documentation:** Swagger/OpenAPI  
**File Upload:** Local file storage (public/uploads)  
**Job Scheduling:** @nestjs/schedule  

---

## Features

### Hazard Analysis & Awareness Management (HAAMI Core)

- **Hazard Identification** - Systematic documentation and classification of workplace hazards
- **Risk Assessment** - Multi-level risk analysis with severity and probability scoring
- **Control Implementation** - Tracking of preventive and protective measures
- **Awareness Programs** - Safety induction management with attendance tracking
- **Policy Dissemination** - Policy management with acknowledgment tracking

### Integrated Control System

- **User Management** - Employee authentication, role-based access (Admin, Supervisor, User), supervisor-subordinate hierarchy
- **Finding Management** - Report and track safety findings with approval workflow, status tracking, and file attachments
- **Department Management** - Organizational structure with department codes
- **Document Control** - Master document list with revision tracking and hierarchical organization
- **Policy Management** - Document management with signature tracking
- **Equipment Registry** - Track and manage safety equipment with inspection scheduling
- **Equipment Inspection History** - Maintain inspection records with status monitoring and alerts
- **Emergency Drills** - Plan, schedule, and document emergency response drills
- **Safety Induction** - Manage induction sessions with QR code-based attendance
- **Incident Investigation** - Document workplace incidents with root cause analysis and corrective action tracking
- **Notifications** - Real-time notification system for findings, approvals, and deadlines
- **Audit Logging** - Track all system changes with user action records
- **Automated Reminders** - Scheduled notifications for deadlines and license expirations

---

## API Documentation

The API is fully documented using Swagger (OpenAPI 3.0).

**Swagger UI Access:** `http://localhost:3001/api/docs`

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

---

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (v14+)
- npm or yarn

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
   
   Create a `.env` file in the root directory. See [Environment Configuration](#environment-configuration) below.

4. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

5. **Seed initial data (optional)**
   ```bash
   npm run seed
   npm run import:karyawan
   ```

---

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=smk3_db

# JWT Configuration
JWT_SECRET=<generate-a-secure-random-secret>
JWT_EXPIRES_IN=30d

# Server Configuration
PORT=3001

# Prisma (full connection string)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/smk3_db"
```

### Environment Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL server hostname | `localhost` |
| `DB_PORT` | PostgreSQL server port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres123` |
| `DB_DATABASE` | Database name | `smk3_db` |
| `JWT_SECRET` | Secret key for JWT token generation | 64+ character random string |
| `JWT_EXPIRES_IN` | JWT token expiration time | `30d`, `7d`, `1h` |
| `PORT` | Application server port | `3001` |
| `DATABASE_URL` | Full database connection string | `postgresql://user:pass@host:port/dbname` |

---

## Database Migrations

This project uses Prisma Migrations for database schema management.

### Generate a New Migration

```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Run Seed Scripts

```bash
# Seed departments
npm run seed

# Import employee data
npm run import:karyawan

# Generate document templates
npm run generate:template
```

---

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The server will start on `http://localhost:3001` with auto-reload enabled.

### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Run the compiled application**
   ```bash
   npm run start:prod
   ```

### Debug Mode

```bash
npm run start:debug
```

This starts the application with Node.js inspector enabled for debugging.

---

## Testing

### Unit Tests

```bash
npm run test
```

### Test with Coverage

```bash
npm run test:cov
```

### E2E Tests

```bash
npm run test:e2e
```

---

## Project Structure

```
crack-be-naz-ahtamir/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   ├── common/                  # Shared utilities and interceptors
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── findings/                # Finding management module
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── findings.controller.ts
│   │   └── findings.service.ts
│   ├── modules/                 # Business domain modules
│   │   ├── departments/
│   │   ├── documents/
│   │   ├── emergency-drill/
│   │   ├── induction/
│   │   ├── investigation/
│   │   ├── k3-policy/
│   │   └── objek-k3/
│   ├── notifications/           # Notification management
│   │   ├── dto/
│   │   ├── notifications.controller.ts
│   │   └── notifications.service.ts
│   ├── prisma/                  # Prisma service and utilities
│   ├── scheduler/               # Scheduled tasks (reminders, notifications)
│   ├── seed-departments.ts      # Department seed script
│   ├── seed.ts                  # Main seed script
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── main.ts                  # Application entry point
├── prisma/
│   ├── migrations/              # Database migrations
│   ├── schema.prisma            # Prisma schema definition
│   └── seed-notifications.ts    # Notification seed script
├── public/
│   └── uploads/                 # Uploaded files (statically served)
├── docs/                        # Documentation
│   ├── ERD.png
│   └── smoke_test.md
├── test/                        # E2E test files
├── .env                         # Environment variables (not committed)
├── .gitignore
├── package.json
├── nest-cli.json
├── tsconfig.json
└── README.md
```

---

## API Modules

### Authentication (`/api/auth`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login, returns JWT token |
| `/api/auth/users` | GET | Get all users |
| `/api/auth/users/:id` | GET | Get user by UUID |
| `/api/auth/users/by-id-karyawan/:id` | GET | Get user by employee ID |
| `/api/auth/users/:id` | PATCH | Update user profile |
| `/api/auth/users/:id/role` | PATCH | Update user role |
| `/api/auth/users/:id/supervisor` | PATCH | Assign supervisor |
| `/api/auth/users/:id/deactivate` | PATCH | Deactivate user |
| `/api/auth/users/:id/activate` | PATCH | Activate user |
| `/api/auth/me/change-password` | POST | Change own password |

### Departments (`/api/departments`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/departments` | GET | Get all departments |
| `/api/departments` | POST | Create new department |
| `/api/departments/seed` | POST | Seed multiple departments |
| `/api/departments/:id` | GET | Get department details |
| `/api/departments/:id` | PUT | Update department |
| `/api/departments/:id` | DELETE | Delete department |

### Findings (`/api/smk3-data`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/smk3-data` | POST | Create new finding |
| `/api/smk3-data` | GET | Get all findings with filters |
| `/api/smk3-data/:id` | GET | Get finding details |
| `/api/smk3-data/:id` | PUT | Update finding |
| `/api/smk3-data/:id/status` | PATCH | Update finding status (approve/reject) |
| `/api/smk3-data/:id` | DELETE | Soft delete finding |
| `/api/smk3-data/deadline-reminders` | GET | Get deadline reminder list |

### Notifications (`/api/notifications`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get user notifications |
| `/api/notifications/unread-count` | GET | Get unread notification count |
| `/api/notifications/read-all` | PATCH | Mark all as read |
| `/api/notifications/:id/read` | PATCH | Mark single notification as read |
| `/api/notifications` | POST | Create notification (admin only) |

### Documents (`/api/documents`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/documents` | GET | Get all documents |
| `/api/documents` | POST | Create document |
| `/api/documents/tree` | GET | Get hierarchical document structure |
| `/api/documents/stats` | GET | Get document statistics |
| `/api/documents/:id` | GET | Get document details |
| `/api/documents/:id` | PUT | Update document |
| `/api/documents/:id` | DELETE | Delete document |

### K3 Policy (`/api/k3-policy`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/k3-policy` | GET | Get all policies |
| `/api/k3-policy/:id` | GET | Get policy details |
| `/api/k3-policy/with-file/:id` | PUT | Update policy with file upload |
| `/api/k3-policy/with-file` | POST | Create policy with file upload |
| `/api/k3-policy/:id` | DELETE | Delete policy |

### Objek K3 (`/api/objek-k3`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/objek-k3` | GET | Get all equipment |
| `/api/objek-k3/:id` | GET | Get equipment details |
| `/api/objek-k3` | POST | Create equipment |
| `/api/objek-k3/:id` | PUT | Update equipment |
| `/api/objek-k3/:id` | DELETE | Delete equipment |
| `/api/objek-k3/:id/riwayat` | GET | Get inspection history |
| `/api/objek-k3/:id/riwayat` | POST | Add inspection record |

### Emergency Drill (`/api/emergency-drill`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/emergency-drill` | GET | Get all drills |
| `/api/emergency-drill/:id` | GET | Get drill details |
| `/api/emergency-drill` | POST | Create drill |
| `/api/emergency-drill/:id` | PUT | Update drill plan |
| `/api/emergency-drill/:id` | DELETE | Delete drill |

### Investigation (`/api/investigations`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/investigations` | GET | Get all investigations |
| `/api/investigations/:id` | GET | Get investigation details |
| `/api/investigations` | POST | Create investigation |
| `/api/investigations/:id` | PUT | Update investigation |
| `/api/investigations/:id/status` | PATCH | Update investigation status |
| `/api/investigations/:id/sign-approval` | PATCH | Sign approval |
| `/api/investigations/:id/logs` | GET | Get investigation logs |

### Safety Induction (`/api/induction`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/induction` | GET | Get all induction sessions |
| `/api/induction/:id` | GET | Get session details |
| `/api/induction` | POST | Create induction session |
| `/api/induction/:id` | PUT | Update session |
| `/api/induction/:id/participants` | POST | Add participant |
| `/api/induction/:id/participants` | GET | Get all participants |
| `/api/induction/:id/participants/scan` | PATCH | Scan QR code for attendance |
| `/api/induction/:id/media` | POST | Upload session media |
| `/api/induction/:id/media` | GET | Get session media |
| `/api/induction/:id/close` | PATCH | Close induction session |
| `/api/induction/:id` | DELETE | Delete session |

---

## Authentication

All API endpoints (except `/api/auth/login`) require authentication via JWT Bearer token.

### Request Header

```
Authorization: Bearer <your_jwt_token>
```

### Login Flow

1. Send POST request to `/api/auth/login` with employee ID and password
2. Response includes `access_token` and user information
3. Use the token in subsequent requests' Authorization header

### Token Expiration

JWT tokens expire after 30 days by default. The expiration time is configurable via the `JWT_EXPIRES_IN` environment variable.

---

## Deployment

### Production Checklist

1. **Environment Setup**
   - Configure `.env` for production
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production database connection

2. **Database**
   - Run migrations: `npx prisma migrate deploy`
   - Verify schema is up to date

3. **Build**
   ```bash
   npm run build
   ```

4. **Start Production Server**
   ```bash
   npm run start:prod
   ```

### Docker Deployment (Optional)

Create a `Dockerfile`:

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

### Health Check

The server responds to GET requests at `/` with a welcome message.

For container orchestrators, implement a custom health check endpoint if needed.

---

## Contact

**Project Maintainer:** Naz Ahtamir  
**Repository:** [Project Repository URL]

---

## License

This project is proprietary and confidential. Unauthorized distribution or reproduction is prohibited.
