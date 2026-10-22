# 🚀 CI/CD Pipeline Documentation

## Overview

Automated Continuous Integration and Deployment pipelines untuk Axon Sales BI Dashboard API menggunakan GitHub Actions.

---

## 📋 Workflows

### 1. Continuous Integration (CI)

**File:** `.github/workflows/ci.yml`

**Triggers:**
- Push ke branch `main`
- Pull Request ke branch `main`

**Jobs:**

#### Build and Test
- **Platform:** Ubuntu Latest
- **Node.js:** 18.x

**Steps:**
1. ✅ **Checkout Code** - Clone repository
2. ✅ **Setup Node.js** - Install Node.js 18.x dengan npm cache
3. ✅ **Install Dependencies** - `npm ci` (clean install)
4. ✅ **Validate Prisma Schema** - Check database schema syntax
5. ✅ **Generate Prisma Client** - Build type-safe client
6. ✅ **Syntax Check** - Validate JavaScript files
7. ✅ **Security Audit** - Check for vulnerabilities
8. ✅ **Lint Check** - Code quality (if configured)

**Duration:** ~2-3 minutes

---

### 2. Continuous Deployment (CD)

**File:** `.github/workflows/cd.yml`

**Triggers:**
- Tag push: `v*` (e.g., `v1.0.0`, `v2.1.3`)

**Jobs:**

#### Deploy to Production
- **Platform:** Ubuntu Latest
- **Condition:** Only on version tags

**Steps:**
1. ✅ **Checkout Code**
2. ✅ **Setup Node.js**
3. ✅ **Install Dependencies**
4. ✅ **Generate Prisma Client**
5. ✅ **Build Docker Image** - Multi-stage production build
6. ✅ **Save Artifact** - Export Docker image
7. ✅ **Upload Artifact** - Store for manual deployment

**Duration:** ~5-7 minutes

---

## 🔧 Configuration

### Required Secrets (for CD)

Jika menggunakan automatic deployment, tambahkan secrets di GitHub:

```
Settings → Secrets and variables → Actions → New repository secret
```

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SERVER_HOST` | Production server IP/hostname | `123.45.67.89` |
| `SERVER_USER` | SSH username | `deploy` |
| `SSH_PRIVATE_KEY` | SSH private key | `-----BEGIN...` |

### Environment Variables

Tidak ada environment variables yang diperlukan untuk CI pipeline karena:
- ✅ Prisma validation tidak butuh database connection
- ✅ Syntax check murni static analysis
- ✅ Build process tidak butuh runtime secrets

---

## 📊 Pipeline Status

### CI Pipeline

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

**Success Criteria:**
- ✅ All dependencies installed successfully
- ✅ Prisma schema valid
- ✅ No syntax errors
- ✅ No high/critical vulnerabilities

### CD Pipeline

```yaml
on:
  push:
    tags: ['v*']
```

**Success Criteria:**
- ✅ Docker image built successfully
- ✅ Image tagged correctly
- ✅ Artifact uploaded

---

## 🎯 Usage Guide

### Running CI Locally

Simulate CI pipeline on local machine:

```bash
# Install dependencies
npm ci

# Validate Prisma
npx prisma validate

# Generate client
npx prisma generate

# Syntax check
node --check config/db.js
node --check server.js

# Security audit
npm audit --audit-level=high
```

### Triggering CI

**Automatic:**
```bash
# Push to main
git push origin main

# Create PR
gh pr create --base main --head feature-branch
```

**Manual Trigger:**
Go to Actions → CI → Run workflow

### Triggering CD

**Create Version Tag:**
```bash
# Create and push tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Or use GitHub CLI
gh release create v1.0.0 --generate-notes
```

---

## 📦 Deployment Process

### Manual Deployment (Recommended for Initial Setup)

1. **Download Artifact**
   - Go to Actions → Latest CD run
   - Download `docker-image` artifact
   - Extract `axon-backend.tar.gz`

2. **Transfer to Server**
   ```bash
   scp axon-backend.tar.gz user@server:/path/to/app/
   ```

3. **Load Image**
   ```bash
   ssh user@server
   cd /path/to/app
   docker load < axon-backend.tar.gz
   ```

4. **Deploy**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   docker compose -f docker-compose.prod.yml exec axon-backend npx prisma migrate deploy
   ```

### Automatic Deployment (Advanced)

Uncomment SSH deployment step di `cd.yml`:

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd /path/to/app
      docker compose -f docker-compose.prod.yml pull
      docker compose -f docker-compose.prod.yml up -d
      docker compose -f docker-compose.prod.yml exec axon-backend npx prisma migrate deploy
```

---

## 🔍 Monitoring & Troubleshooting

### View Pipeline Logs

```
GitHub → Actions → Select workflow run → Click on job
```

### Common Issues

#### 1. CI Failed: Prisma Validation Error

**Error:**
```
Error: Schema validation error
```

**Solution:**
- Check `prisma/schema.prisma` syntax
- Ensure relations are correct
- Run `npx prisma validate` locally

#### 2. CI Failed: Npm Audit

**Error:**
```
High severity vulnerabilities found
```

**Solution:**
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (breaking changes possible)
npm audit fix --force

# Update specific package
npm update package-name
```

#### 3. CD Failed: Docker Build

**Error:**
```
Error building Docker image
```

**Solution:**
- Verify `Dockerfile` syntax
- Check base image availability
- Test build locally: `docker build -t test .`

#### 4. Deployment Failed: Database Connection

**Error:**
```
Can't reach database server
```

**Solution:**
- Check `.env` variables on server
- Verify Docker network
- Check PostgreSQL container status

---

## 📈 Pipeline Optimization

### Caching Strategy

**npm cache:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ✅ Enabled
```

**Benefits:**
- 30-50% faster dependency installation
- Reduced bandwidth usage

### Parallel Jobs (Future Enhancement)

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps: [...]
```

---

## 🔒 Security Best Practices

### Secrets Management

✅ **Do:**
- Use GitHub Secrets for credentials
- Rotate SSH keys regularly
- Use environment-specific secrets

❌ **Don't:**
- Commit secrets to repository
- Use same credentials across environments
- Share secrets in logs

### Audit Trail

All deployments logged in:
- GitHub Actions run history
- Docker image tags (version tracking)
- Git tags (release history)

---

## 📊 Metrics & KPIs

### CI Pipeline

- **Average Duration:** 2-3 minutes
- **Success Rate Target:** >95%
- **Max Duration:** 5 minutes

### CD Pipeline

- **Average Duration:** 5-7 minutes
- **Build Size:** ~150-200MB (compressed)
- **Deployment Frequency:** On-demand (tag-based)

---

## 🎓 Best Practices

### Branch Strategy

```
main (protected)
  ↑
  └── feature/* (PR required)
  └── hotfix/* (PR required)
```

**Rules:**
- Direct push to `main` blocked
- Require PR review (1+ approver)
- Require CI pass before merge
- Squash merge for clean history

### Versioning

**Semantic Versioning:**
```
v1.0.0 - Major.Minor.Patch
│ │ │
│ │ └─ Bug fixes (backwards compatible)
│ └─── New features (backwards compatible)
└───── Breaking changes
```

**Examples:**
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New endpoint added
- `v2.0.0` - Breaking API changes

### Rollback Strategy

**Quick Rollback:**
```bash
# List tags
git tag -l

# Deploy previous version
git checkout v1.0.0
docker compose -f docker-compose.prod.yml up -d

# Or use previous Docker image
docker tag axon-backend:v1.0.0 axon-backend:latest
docker compose -f docker-compose.prod.yml up -d
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist

### Before First Deployment

- [ ] CI pipeline tested and passing
- [ ] Docker image builds successfully
- [ ] Production `.env` configured
- [ ] Database backup strategy in place
- [ ] Monitoring/logging setup
- [ ] Rollback plan documented

### Regular Maintenance

- [ ] Review failed pipelines weekly
- [ ] Update dependencies monthly
- [ ] Audit security vulnerabilities
- [ ] Review and cleanup old artifacts
- [ ] Update documentation

---

**Version:** 1.0.0  
**Last Updated:** 2026-10-22  
**Status:** ✅ Ready for Use
