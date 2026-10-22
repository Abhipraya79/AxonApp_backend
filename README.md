# AxonApp Backend - Sales BI Dashboard API

Backend API untuk Axon Sales BI Dashboard menggunakan **Node.js + Express + Prisma ORM + PostgreSQL**.

🔒 **Security Compliant** - Follows DevSecOps best practices. See [SECURITY.md](SECURITY.md) for details.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- Docker & Docker Compose
- Git

### Setup (Development)

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd AxonApp_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start PostgreSQL**
   ```bash
   docker compose up -d
   ```

5. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed database (optional)**
   ```bash
   npx prisma db seed
   ```

7. **Start server**
   ```bash
   npm run dev
   ```

Server running: `http://localhost:5000`

---

## 🐳 Docker Deployment

### Development Mode
```bash
# Database only, backend on host
docker compose up -d
npm run dev
```

### Production Mode
```bash
# Full stack containerized
docker compose -f docker-compose.prod.yml up -d --build

# Run migrations inside container
docker compose -f docker-compose.prod.yml exec axon-backend npx prisma migrate deploy

# Check health
docker compose -f docker-compose.prod.yml ps
```

---

## 📁 Project Structure

```
AxonApp_backend/
├── config/
│   └── db.js              # Prisma Client
├── controllers/           # 7 controllers
├── models/                # 7 data models
├── routes/                # 8 route files
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
├── docker-compose.yml         # Development
├── docker-compose.prod.yml    # Production
├── Dockerfile
├── .dockerignore
├── .gitignore
├── SECURITY.md               # Security guidelines
└── server.js
```

---

## 🔌 API Endpoints (18 Total)

### Analytics (`/api/analytics`)
- `GET /kpi` - Dashboard KPI metrics
- `GET /sales-trend` - Monthly sales trend
- `GET /customer-distribution` - Customer by country

### Products (`/api/products`)
- `GET /` - Product catalog (pagination, search)
- `GET /top-selling` - Top selling products
- `GET /categories` - Performance by product line
- `GET /unsold` - Dead stock

### Customers (`/api/customers`)
- `GET /` - CRM customer list
- `GET /top` - Top VIP customers

### Orders (`/api/orders`)
- `GET /` - Order history (filter, pagination)
- `GET /on-hold` - On-hold orders
- `GET /shipping-delays` - Shipping delays analysis

### Offices (`/api/offices`)
- `GET /performance` - Regional office performance

### Finances (`/api/finances`)
- `GET /payments` - Payment history
- `GET /revenue-vs-cash` - Revenue vs cash flow

### Performance (`/api/performance`)
- `GET /employees` - Sales rep performance
- `GET /teams` - Team performance by manager
- `GET /vendors` - Vendor analysis

**Full documentation:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🛠️ Development Commands

```bash
# Development with hot-reload
npm run dev

# Production
npm start

# Generate Prisma Client (after schema changes)
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (GUI)
npx prisma studio

# Docker logs
docker compose logs -f postgres-db
docker compose -f docker-compose.prod.yml logs -f axon-backend
```

---

## 🔐 Security Features

✅ **No hardcoded credentials** - All use `process.env`  
✅ **Port binding to localhost** - `127.0.0.1:5432:5432`  
✅ **Custom Docker network** - Isolated services  
✅ **Health checks** - Database and backend monitoring  
✅ **Non-root container** - Runs as `nodejs` user  
✅ **Multi-stage build** - Minimal attack surface  
✅ **Gitignore protection** - Secrets excluded  

See [SECURITY.md](SECURITY.md) for complete security guide.

---

## 🧪 Testing Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# KPI metrics
curl http://localhost:5000/api/analytics/kpi

# Top customers
curl http://localhost:5000/api/customers/top?limit=5

# Revenue vs cash
curl http://localhost:5000/api/finances/revenue-vs-cash
```

---

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | Prisma connection string | `postgresql://user:pass@host:5432/db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `strong_password` |
| `DB_NAME` | Database name | `axon_sales_try` |
| `DB_PORT` | Database port | `5432` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:5173` |

Copy `.env.example` to `.env` and configure.

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Kill process
Stop-Process -Id <PID> -Force
```

### Database Connection Failed
```bash
# Check Docker container
docker compose ps

# Restart database
docker compose restart postgres-db

# View logs
docker compose logs postgres-db
```

### Prisma Client Error
```bash
# Regenerate client
npx prisma generate

# Reset database (⚠️ deletes data)
npx prisma migrate reset
```

---

## 📦 Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **ORM:** Prisma v5
- **Database:** PostgreSQL 15
- **Container:** Docker & Docker Compose
- **Dev Tools:** Nodemon

---

## 👥 Team Workflow

1. Pull latest: `git pull`
2. Install deps: `npm install`
3. Docker up: `docker compose up -d`
4. Migrate: `npx prisma migrate dev`
5. Dev: `npm run dev`

---

## 📝 API Response Format

All endpoints follow standard format:

**Success:**
```json
{
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "stack": "..."
}
```

---

## 📚 Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete endpoint reference
- [Security Guide](SECURITY.md) - DevSecOps best practices
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Development notes

---

## 🎯 Production Deployment

1. Set production environment variables
2. Use `docker-compose.prod.yml`
3. Setup reverse proxy (Nginx/Caddy) with SSL
4. Configure firewall rules
5. Enable automated backups
6. Setup monitoring & logging

See [SECURITY.md](SECURITY.md) for deployment checklist.

---

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Security Audit:** ✅ Passed (2026-10-22)
