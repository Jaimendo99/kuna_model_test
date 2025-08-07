# Kuna Therapist Matching - Coolify Deployment Guide

This document provides step-by-step instructions for deploying the Kuna Therapist Matching application using Coolify.

## Prerequisites

1. A VPS with Coolify installed
2. Domain name configured to point to your VPS
3. Git repository with your code

## Project Structure

# 🚀 Kuna Therapist Matching - Coolify Deployment Guide

This guide explains how to deploy the Kuna Therapist Matching platform to a VPS using Coolify.

## 📋 Prerequisites

1. **VPS with Coolify installed**

   - Ubuntu 20.04+ or similar
   - Coolify v4+ installed
   - Docker and Docker Compose configured
   - Domain name pointed to your VPS

2. **Required Environment Variables**
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `FRONTEND_URL`: Your frontend domain (e.g., https://kuna.yourdomain.com)

### 🏗️ Project Structure

```tree
kuna-monorepo/
├── packages/
│   ├── backend/          # FastAPI backend
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── ...
│   ├── frontend/         # React frontend
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── nginx.conf
│   │   └── ...
│   └── database/         # Database migrations and SQL
│       ├── migrate_therapist_table.py
│       └── init.sql
├── docker-compose.yml    # Local development
└── coolify-config.yml    # Coolify configuration
```

## 🎯 Deployment Strategy

### Option 1: Separate Services (Recommended)

Deploy each component as a separate Coolify application:

1. **Backend Service** (API)
2. **Frontend Service** (Web App)
3. **Database** (Persistent Volume)

### Option 2: Monolithic Deployment

Deploy as a single application with docker-compose.

## 📝 Step-by-Step Deployment

### 1. Setup Repository

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Ensure the monorepo structure is in place
3. Make sure all Dockerfiles are properly configured

### 2. Deploy Backend Service

#### In Coolify Dashboard:

1. **Create New Application**

   - Name: `kuna-backend`
   - Type: Docker Compose

2. **Configure Repository**

   - Repository URL: `https://github.com/your-username/kuna-therapist-matching`
   - Branch: `main`
   - Build Pack: Docker Compose
   - Docker Compose Location: `packages/backend/docker-compose.yml`

3. **Environment Variables**

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8002
   DATABASE_URL=sqlite:///./data/therapist_matching.db
   ```

4. **Persistent Storage**

   - Create volume: `kuna_database`
   - Mount to: `/app/data`

5. **Domain Configuration**
   - Add domain: `api.yourdomain.com`
   - Enable SSL/TLS
   - Configure reverse proxy

### 3. Deploy Frontend Service

#### In Coolify Dashboard:

1. **Create New Application**

   - Name: `kuna-frontend`
   - Type: Docker Compose

2. **Configure Repository**

   - Repository URL: Same as backend
   - Branch: `main`
   - Build Pack: Docker Compose
   - Docker Compose Location: `packages/frontend/docker-compose.yml`

3. **Environment Variables**

   ```env
   VITE_API_URL=https://api.yourdomain.com
   PORT=80
   ```

4. **Domain Configuration**
   - Add domain: `kuna.yourdomain.com`
   - Enable SSL/TLS
   - Configure reverse proxy

### 4. Database Setup

#### Initialize Database:

1. SSH into your VPS or use Coolify terminal
2. Run database migration:
   ```bash
   docker exec -it kuna-backend python migrate_therapist_table.py
   ```

## 🔧 Configuration Files

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data

EXPOSE 8002

ENV PYTHONPATH=/app
ENV DATABASE_URL=sqlite:///./data/therapist_matching.db

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3
  CMD curl -f http://localhost:8002/health || exit 1

CMD ["python", "main.py"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3
  CMD curl -f http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

## 🌐 Environment Configuration

### Production Environment Variables

#### Backend (.env)

```env
# API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key
DATABASE_URL=sqlite:///./data/therapist_matching.db
PORT=8002

# CORS Origins
FRONTEND_URL=https://kuna.yourdomain.com

# Logging
LOG_LEVEL=INFO
```

#### Frontend (.env)

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com

# Build Configuration
NODE_ENV=production
```

## 🔒 Security Considerations

1. **SSL/TLS**: Enable HTTPS for both frontend and backend
2. **Environment Variables**: Store sensitive data in Coolify's environment variable manager
3. **CORS**: Configure proper CORS origins
4. **Database**: Consider moving to PostgreSQL for production
5. **Backups**: Setup automated database backups

## 📊 Monitoring

### Health Checks

Both services include health check endpoints:

- Backend: `https://api.yourdomain.com/health`
- Frontend: `https://kuna.yourdomain.com/health`

### Logs

Access logs through Coolify dashboard:

1. Go to Application → Logs
2. View real-time logs
3. Filter by service

## 🔄 CI/CD Pipeline

### Automatic Deployment

1. **Setup Webhooks** in Coolify
2. **Configure GitHub Actions** (optional):

   ```yaml
   name: Deploy to Coolify
   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to Coolify
           run: |
             curl -X POST "https://coolify.yourdomain.com/webhooks/deploy" 
               -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Check if volume is properly mounted
   - Verify DATABASE_URL environment variable

2. **CORS Errors**

   - Update FRONTEND_URL in backend environment
   - Check CORS origins in main.py

3. **Build Failures**

   - Check Dockerfile syntax
   - Verify all dependencies are installed

4. **Port Conflicts**
   - Ensure ports are not already in use
   - Check Coolify port mapping

### Debug Commands

```bash
# Check container logs
docker logs kuna-backend
docker logs kuna-frontend

# Access container shell
docker exec -it kuna-backend bash
docker exec -it kuna-frontend sh

# Check database
docker exec -it kuna-backend python -c "
from database import get_db
db = next(get_db())
from database import Therapist
print(f'Therapists count: {db.query(Therapist).count()}')
"
```

## 📚 Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 🎉 Post-Deployment

After successful deployment:

1. **Test the Application**

   - Visit `https://kuna.yourdomain.com`
   - Test therapist registration
   - Test patient questionnaire

2. **Setup Analytics** (optional)

   - Google Analytics
   - Application monitoring

3. **Configure Backups**

   - Database backups
   - Application backups

4. **Performance Optimization**
   - CDN setup
   - Caching configuration
   - Load testing

---

## 📞 Support

If you encounter issues during deployment:

1. Check the Coolify logs
2. Review the application health checks
3. Verify environment variables
4. Check domain DNS configuration

Good luck with your deployment! 🚀
├── backend/ # FastAPI backend
│ ├── Dockerfile
│ ├── main.py
│ ├── database.py
│ ├── requirements.txt
│ └── ...
├── frontend/ # React frontend
│ ├── Dockerfile
│ ├── package.json
│ └── ...
├── database/ # Database files and init scripts
│ ├── init.sql
│ └── ...
├── docker-compose.yml
└── .env.example

```

## Deployment Steps

### 1. Prepare Your Repository

1. Push your reorganized code to a Git repository (GitHub, GitLab, etc.)
2. Ensure all three components (backend, frontend, database) are in separate folders

### 2. Deploy Database (PostgreSQL)

1. In Coolify, go to **Projects** → **Create New Project**
2. Name it "kuna-database"
3. Add a **PostgreSQL** service:
   - Name: `kuna-postgres`
   - Version: `15-alpine`
   - Database: `kuna_therapist_matching`
   - Username: `kuna_user`
   - Password: Generate a secure password and save it
   - Persistent storage: Enable
   - Port: `5432` (internal)

### 3. Deploy Backend API

1. In the same project, add a new **Docker Service**:
   - Name: `kuna-backend`
   - Source: Your Git repository
   - Build path: `/backend`
   - Dockerfile: `Dockerfile`
   - Port: `8000`

2. Set environment variables:
```

DATABASE_URL=postgresql://kuna_user:YOUR_PASSWORD@kuna-postgres:5432/kuna_therapist_matching
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_super_secret_key_minimum_32_chars
PORT=8000
FRONTEND_URL=https://your-frontend-domain.com

```

3. Set up domain/subdomain (e.g., `api.yourdomain.com`)

### 4. Deploy Frontend

1. Add another **Docker Service** to the same project:
- Name: `kuna-frontend`
- Source: Your Git repository
- Build path: `/frontend`
- Dockerfile: `Dockerfile`
- Port: `3000`

2. Set environment variables:
```

VITE_API_URL=https://api.yourdomain.com

```

3. Set up domain (e.g., `app.yourdomain.com`)

### 5. Configure Service Dependencies

1. In Coolify, ensure the services start in the correct order:
- Database first
- Backend (depends on database)
- Frontend (depends on backend)

2. Use internal network names for service communication:
- Backend connects to database via: `kuna-postgres:5432`
- Frontend connects to backend via the public domain

### 6. SSL and Domain Configuration

1. Enable SSL certificates for both frontend and backend domains
2. Configure DNS records:
- `api.yourdomain.com` → Your VPS IP
- `app.yourdomain.com` → Your VPS IP

### 7. Deploy and Test

1. Deploy all services in Coolify
2. Check logs for any errors
3. Test the application:
- Frontend: `https://app.yourdomain.com`
- Backend API: `https://api.yourdomain.com/health`
- Database connection through backend

## Environment Variables Reference

### Backend (.env)
```

DATABASE_URL=postgresql://kuna_user:PASSWORD@kuna-postgres:5432/kuna_therapist_matching
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_super_secret_key_minimum_32_chars
PORT=8000
FRONTEND_URL=https://app.yourdomain.com

```

### Frontend (.env)
```

VITE_API_URL=https://api.yourdomain.com

```

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL service is running
   - Verify network connectivity between services

2. **CORS Errors**
   - Update FRONTEND_URL in backend environment
   - Check VITE_API_URL in frontend environment
   - Ensure domains are correctly configured

3. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies in requirements.txt/package.json
   - Check build logs in Coolify

### Health Checks:

- Backend: `GET /health`
- Database: Check PostgreSQL logs in Coolify
- Frontend: Access the application URL

## Monitoring and Maintenance

1. **Logs**: Monitor application logs through Coolify dashboard
2. **Backups**: Set up automatic database backups
3. **Updates**: Use Coolify's deployment features for rolling updates
4. **Scaling**: Configure resource limits based on usage

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **Database**: Use strong passwords and limit access
3. **SSL**: Always use HTTPS in production
4. **Firewall**: Configure appropriate security groups/firewall rules
5. **Updates**: Keep dependencies and base images updated

## Alternative: Single Docker Compose Deployment

If you prefer to deploy everything as a single stack:

1. Use the provided `docker-compose.yml`
2. Create a **Docker Compose** service in Coolify
3. Point to your repository root
4. Set all environment variables
5. Configure domains for the frontend service

This approach deploys all components together but is less flexible for scaling individual services.
```
