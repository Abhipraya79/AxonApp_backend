# 🔒 Security & Infrastructure Guide

## Security Audit Compliance ✅

This project follows DevSecOps best practices for production-ready deployment.

---

## 🛡️ Security Features Implemented

### 1. Environment Variables Protection

✅ **No hardcoded credentials** in source code
✅ All sensitive data uses `process.env`
✅ `.env` excluded from Git via `.gitignore`
✅ `.env.example` provided as template

**Protected Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database credentials
- `PORT` - Server port
- `CLIENT_URL` - CORS allowed origin

### 2. Docker Security

#### Development (`docker-compose.yml`)
✅ **Port binding to localhost only**: `127.0.0.1:5432:5432`
✅ **Custom network**: `axon-network` (isolated from default bridge)
✅ **Named volumes**: `pgdata` for data persistence
✅ **Health checks**: `pg_isready` for database readiness
✅ **Service dependencies**: `depends_on` with health condition

#### Production (`docker-compose.prod.yml`)
✅ **Database internal only**: No published ports (backend → DB via network)
✅ **Backend localhost binding**: `127.0.0.1:5000:5000`
✅ **Restart policy**: `always` for high availability
✅ **Health checks**: Both DB and backend monitored

#### Dockerfile Security
✅ **Multi-stage build**: Smaller final image
✅ **Alpine base image**: `node:18-alpine` (minimal attack surface)
✅ **Non-root user**: Runs as `nodejs` user (UID 1001)
✅ **Dumb-init**: Proper signal handling (PID 1)
✅ **Build-time secrets**: No credentials baked into image

### 3. File System Protection

**`.gitignore` covers:**
- ✅ Environment files (`.env`, `.env.*`)
- ✅ Database dumps (`*.dump`, `*.sql`, `*.backup`)
- ✅ Node modules
- ✅ Logs and temporary files
- ✅ IDE configurations

**`.dockerignore` excludes:**
- ✅ Development files
- ✅ Git history
- ✅ Documentation (except README)
- ✅ Local database files

---

## 🚀 Deployment Modes

### Development Mode

```bash
# Start database only (backend runs on host)
docker compose up -d

# Backend runs locally with hot-reload
npm run dev
```

**Access:**
- Database: `localhost:5432` (from host)
- Backend: `localhost:5000` (from host)

### Production Mode

```bash
# Build and start both services
docker compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker compose -f docker-compose.prod.yml exec axon-backend npx prisma migrate deploy

# Check health
docker compose -f docker-compose.prod.yml ps
```

**Access:**
- Database: Internal only (not exposed)
- Backend: `localhost:5000` (proxied via Nginx/Caddy)

---

## 🔐 Security Checklist

### Before Git Commit
- [ ] `.env` not tracked
- [ ] No credentials in code
- [ ] Sensitive files in `.gitignore`
- [ ] `package-lock.json` committed

### Before Production Deploy
- [ ] Strong database password set
- [ ] `NODE_ENV=production`
- [ ] Database port not exposed externally
- [ ] CORS `CLIENT_URL` configured correctly
- [ ] Health checks working
- [ ] Logs monitoring configured
- [ ] Backup strategy in place

### Network Security
- [ ] Database accessible only via Docker network
- [ ] Backend bound to `127.0.0.1` (not `0.0.0.0`)
- [ ] Reverse proxy (Nginx/Caddy) with SSL/TLS
- [ ] Firewall rules configured
- [ ] Rate limiting enabled (reverse proxy level)

---

## 🔧 Security Configuration Examples

### Nginx Reverse Proxy (Recommended)

```nginx
upstream axon_backend {
    server 127.0.0.1:5000;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://axon_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Environment Variables Template

```bash
# Copy and configure
cp .env.example .env

# Generate strong password
openssl rand -base64 32

# Set production values
NODE_ENV=production
DATABASE_URL=postgresql://axon_user:STRONG_PASSWORD@localhost:5432/axon_sales_prod
CLIENT_URL=https://dashboard.yourdomain.com
```

---

## 📊 Database Backup Strategy

```bash
# Manual backup
docker compose exec postgres-db pg_dump -U ${DB_USER} ${DB_NAME} > backup_$(date +%Y%m%d).sql

# Automated daily backup (cron)
0 2 * * * docker compose -f /path/to/docker-compose.prod.yml exec -T postgres-db pg_dump -U axon_user axon_sales_try | gzip > /backups/axon_$(date +\%Y\%m\%d).sql.gz
```

---

## 🚨 Incident Response

### Database Compromise
1. Immediately rotate credentials
2. Review access logs
3. Restore from backup
4. Update firewall rules

### Container Breach
1. Stop affected container
2. Review logs: `docker logs axon_backend_prod`
3. Rebuild from clean image
4. Scan for vulnerabilities: `docker scan`

---

## 📚 Additional Resources

- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Prisma Security](https://www.prisma.io/docs/guides/security)

---

**Last Updated:** 2026-10-22
**Audit Status:** ✅ PASSED
