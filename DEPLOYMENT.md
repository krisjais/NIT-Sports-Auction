# Deployment Guide

This guide provides instructions for deploying the NIT Sports Auction platform to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates ready
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring setup (e.g., DataDog, New Relic)
- [ ] CDN configured for static assets
- [ ] Database indexes created
- [ ] Load balancer configured
- [ ] Domain DNS configured

## Environment Configuration

### Production `.env.local`

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/nit-sports-auction

# JWT
JWT_SECRET=your_very_long_secure_production_secret_key_at_least_64_chars
JWT_EXPIRY=7d

# API URLs
NEXT_PUBLIC_API_URL=https://auction.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://auction.yourdomain.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_very_secure_admin_password

# Environment
NODE_ENV=production
```

## Database Setup

### MongoDB Atlas

1. **Create Cluster**
   - Go to mongodb.com/cloud
   - Sign up/Login
   - Create new organization and project
   - Create M10+ cluster (not free tier for production)

2. **Security Setup**
   - Enable IP Whitelisting
   - Add production server IP
   - Create database user with strong password
   - Enable encryption at rest

3. **Create Indexes**
   ```javascript
   // Run in MongoDB shell
   db.users.createIndex({ username: 1 }, { unique: true })
   db.players.createIndex({ status: 1 })
   db.teams.createIndex({ name: 1 }, { unique: true })
   db.auctionlogs.createIndex({ createdAt: -1 })
   ```

4. **Backup Configuration**
   - Enable automated backups
   - Configure backup retention (30 days minimum)
   - Test restore procedure

## Application Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect GitHub to Vercel
   - Import project

2. **Configure Environment**
   - Add environment variables in Vercel dashboard
   - Ensure `MONGODB_URI` and `JWT_SECRET` are set

3. **Deploy**
   - Vercel automatically builds and deploys
   - Custom domain configuration available
   - Automatic SSL certificate

4. **Monitoring**
   - Enable Vercel Analytics
   - Configure error tracking

### Option 2: Docker (AWS/GCP/Azure)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   ENV NODE_ENV=production

   CMD ["npm", "start"]
   ```

2. **Build and Push**
   ```bash
   docker build -t nit-auction:latest .
   docker tag nit-auction:latest your-registry/nit-auction:latest
   docker push your-registry/nit-auction:latest
   ```

3. **Deploy on AWS ECS**
   - Create ECS cluster
   - Create task definition with Docker image
   - Create service (desired count: 2-3)
   - Configure load balancer
   - Enable auto-scaling

### Option 3: Traditional VPS (DigitalOcean, Linode)

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js and npm
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MongoDB
   curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \
     sudo apt-key add -
   ubuntu_version="$(lsb_release -cs)"
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu \
     ${ubuntu_version}/mongodb-org/6.0 multiverse" | \
     sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt update
   sudo apt install -y mongodb-org

   # Install Nginx
   sudo apt install -y nginx

   # Install PM2
   npm install -g pm2
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone <your-repo> /opt/nit-auction
   cd /opt/nit-auction

   # Install dependencies
   npm install --production

   # Build
   npm run build

   # Start with PM2
   pm2 start npm --name "nit-auction" -- start
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name auction.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name auction.yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/auction.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/auction.yourdomain.com/privkey.pem;

       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /socket.io {
           proxy_pass http://localhost:3000/socket.io;
           proxy_http_version 1.1;
           proxy_buffering off;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
       }
   }
   ```

4. **Enable Firewall**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

5. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d auction.yourdomain.com
   ```

## Security Hardening

### 1. Update Dependencies
```bash
npm audit
npm audit fix
npm update
```

### 2. Environment-based Settings
```javascript
// In API routes
if (process.env.NODE_ENV === 'production') {
  // Stricter validation
  // Rate limiting
  // CORS restrictions
}
```

### 3. Database Security
- Use connection string with authentication
- Enable encryption in transit (SSL)
- Enable encryption at rest
- Regular backups
- Point-in-time recovery enabled

### 4. API Security
- CORS configured correctly
- HTTPS enforced
- Rate limiting implemented
- Input validation on all endpoints
- CSRF tokens if needed

### 5. Password Security
- Strong password hashing (bcryptjs)
- Password rotation policy
- API keys rotation
- SSH keys for deployment

## Monitoring & Alerts

### Application Metrics
- Response time
- Error rate
- CPU usage
- Memory usage
- Disk space

### Database Metrics
- Query performance
- Connection pool
- Replication lag
- Backup status

### Setup Monitoring
```bash
# Using PM2 Plus (recommended)
pm2 plus

# Or setup dedicated monitoring
# - DataDog
# - New Relic
# - Scout APM
```

### Error Tracking
```bash
# Install Sentry
npm install @sentry/node @sentry/tracing

# Initialize in app
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Performance Optimization

### 1. Database
- Add indexes for frequently queried fields
- Use query optimization
- Implement connection pooling
- Archive old auction logs

### 2. Caching
- Redis for session storage
- CDN for static assets
- Browser caching headers

### 3. Image Optimization
- Use Cloudinary with transformations
- Implement lazy loading
- Responsive images with srcset

### 4. Code Optimization
- Minify CSS/JS
- Tree shaking
- Code splitting
- Remove unused dependencies

## Logging & Auditing

### Application Logs
```bash
# Configure log rotation
npm install winston

# Log levels: error, warn, info, debug
```

### Audit Logs
- Admin actions logged
- Bid history tracked
- Budget changes recorded
- Authentication events logged

## Backup & Disaster Recovery

### Backup Strategy
- Daily automated backups
- Weekly full backups
- Monthly long-term storage
- Point-in-time recovery enabled

### Recovery Plan
- Document recovery procedures
- Test recovery regularly
- Maintain multiple backup locations
- Regular restore testing

### RTO/RPO Targets
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes

## Load Balancing

### For High Traffic
1. Multiple application servers
2. Load balancer (Nginx, HAProxy, AWS ELB)
3. Sticky sessions for WebSocket
4. Health checks enabled

### Auto-scaling
```
Min instances: 2
Max instances: 10
Scale up trigger: CPU > 70%
Scale down trigger: CPU < 30%
```

## Update & Maintenance

### Regular Updates
- Security patches: immediate
- Bug fixes: within 24 hours
- Feature updates: scheduled maintenance window

### Maintenance Window
- 2-4 AM UTC on Sundays
- Notify users 24 hours in advance
- Estimated downtime: 15 minutes

## Production Checklist

- [ ] SSL/TLS certificates installed
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] Monitoring setup complete
- [ ] Error tracking configured
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Load balancer configured
- [ ] CDN enabled
- [ ] Health checks configured
- [ ] Disaster recovery tested
- [ ] Documentation updated
- [ ] Team trained on ops procedures

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `MONGODB_URI`
   - Verify IP whitelist
   - Check network connectivity
   - Review connection pool settings

2. **Out of Memory**
   - Check Node.js heap size
   - Review memory-intensive operations
   - Implement caching
   - Add more memory/instances

3. **High Response Time**
   - Check database query performance
   - Review indexes
   - Check network latency
   - Review Socket.IO connections

4. **WebSocket Connection Issues**
   - Check CORS configuration
   - Verify proxy configuration
   - Check firewall rules
   - Review Socket.IO version compatibility

---

**Last Updated**: April 2025
**Version**: 1.0.0
