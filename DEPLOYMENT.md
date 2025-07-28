# Deployment Guide

This document provides detailed instructions for deploying the Online Grocery Ordering System in different environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Development Deployment](#development-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### For Docker Deployment (Recommended)
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

### For Local Development
- Java 17+
- Node.js 18+
- Maven 3.6+
- PostgreSQL 13+ (for production)

## Development Deployment

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
- Runs on: http://localhost:8080
- Database: H2 in-memory
- Profile: dev (default)

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
- Runs on: http://localhost:3000
- Auto-reloads on changes
- Proxies API calls to backend

## Production Deployment

### 1. Environment Setup
Create `.env` file in root directory:
```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/grocerydb
DB_USERNAME=admin
DB_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-key-minimum-256-bits-long
JWT_EXPIRATION_MS=86400000

# Optional: Custom ports
BACKEND_PORT=8080
FRONTEND_PORT=3000
```

### 2. Database Setup
```sql
-- PostgreSQL setup
CREATE DATABASE grocerydb;
CREATE USER admin WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE grocerydb TO admin;
```

### 3. Backend Production Build
```bash
cd backend
./mvnw clean package -Pprod
java -jar target/grocerystore-1.0.0.jar --spring.profiles.active=prod
```

### 4. Frontend Production Build
```bash
cd frontend
npm install
npm run build
# Serve with nginx or any static file server
```

## Docker Deployment

### Quick Start
```bash
# Clone repository
git clone https://github.com/chirag127/sprint2-2.git
cd sprint2-2

# Start all services
docker-compose up --build
```

### Services
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: PostgreSQL on port 5432

### Docker Commands
```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# Remove volumes (reset database)
docker-compose down -v
```

## Environment Configuration

### Backend Profiles
- **dev**: H2 database, debug logging
- **prod**: PostgreSQL, optimized settings

### Frontend Environment Variables
```env
# Optional: Custom API URL
REACT_APP_API_URL=http://localhost:8080/api
```

### Docker Environment Variables
Set in `docker-compose.yml` or `.env` file:
```yaml
environment:
  - SPRING_PROFILES_ACTIVE=prod
  - DB_URL=jdbc:postgresql://db:5432/grocerydb
  - JWT_SECRET=${JWT_SECRET}
```

## Health Checks

### Backend Health
```bash
curl http://localhost:8080/actuator/health
```

### Database Connection
```bash
# H2 Console (dev only)
http://localhost:8080/h2-console

# PostgreSQL
psql -h localhost -U admin -d grocerydb
```

## Performance Tuning

### Backend (application.properties)
```properties
# JVM settings
server.tomcat.max-threads=200
spring.datasource.hikari.maximum-pool-size=20

# Logging
logging.level.com.example.grocerystore=INFO
logging.level.org.springframework.security=WARN
```

### Frontend Build Optimization
```bash
# Analyze bundle size
npm run build
npx serve -s build
```

## Security Considerations

### Production Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret (256+ bits)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor application logs
- [ ] Update dependencies regularly

### SSL/TLS Setup
```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
    }
}
```

## Monitoring

### Application Metrics
- Spring Boot Actuator endpoints
- Database connection pool metrics
- JVM memory usage
- Request/response times

### Log Aggregation
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Application logs
tail -f backend/logs/application.log
```

## Backup Strategy

### Database Backup
```bash
# PostgreSQL backup
pg_dump -h localhost -U admin grocerydb > backup.sql

# Restore
psql -h localhost -U admin grocerydb < backup.sql
```

### Application Backup
- Source code: Git repository
- Configuration: Environment variables
- Data: Database dumps
- Assets: Static files

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :8080
   ```

2. **Database connection errors**
   ```bash
   # Check PostgreSQL status
   systemctl status postgresql
   ```

3. **Memory issues**
   ```bash
   # Increase JVM heap size
   java -Xmx2g -jar grocerystore-1.0.0.jar
   ```

4. **CORS errors**
   - Check frontend URL in backend CORS configuration
   - Verify API base URL in frontend

### Debug Mode
```bash
# Backend debug
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Frontend debug
npm start
# Open browser dev tools
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review Docker container status
5. Consult troubleshooting section

---

**Last Updated**: 2025-07-28T15:55:11.822Z  
**Author**: Chirag Singhal (`chirag127`)
