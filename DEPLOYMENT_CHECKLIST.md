# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### ✅ Environment Setup

- [ ] All environment variables configured in `.env` files
- [ ] Database credentials are secure (not default `user:password`)
- [ ] CORS origins properly configured (no wildcards in production)
- [ ] API URLs point to production domains
- [ ] File upload size limits are appropriate
- [ ] Whisper model size chosen based on resources

### ✅ Security

- [ ] Database password changed from default
- [ ] PostgreSQL not exposed to public internet (or properly secured)
- [ ] CORS configured with specific allowed origins
- [ ] File upload validation in place
- [ ] Rate limiting considered (not implemented yet)
- [ ] HTTPS configured for production
- [ ] API authentication considered (not implemented yet)

### ✅ Infrastructure

- [ ] Sufficient disk space for video uploads (recommend 100GB+)
- [ ] Sufficient RAM for ML models (minimum 4GB, recommend 8GB+)
- [ ] GPU available for faster processing (optional but recommended)
- [ ] FFmpeg installed on host system
- [ ] Docker and Docker Compose installed
- [ ] Backup strategy for database
- [ ] Backup strategy for uploaded videos

### ✅ Testing

- [ ] Run `./test_setup.sh` successfully
- [ ] Upload test video and verify processing
- [ ] Test transcription accuracy
- [ ] Test semantic search functionality
- [ ] Test object detection
- [ ] Test emotion analysis
- [ ] Verify all API endpoints work
- [ ] Test video streaming playback

## Production Configuration

### Backend (.env)

```env
# Production Database (use strong password!)
DATABASE_URL=postgresql://prod_user:STRONG_PASSWORD_HERE@db:5432/videodb

# Vector Database
QDRANT_HOST=qdrant
QDRANT_PORT=6333

# AI Models (choose based on resources)
WHISPER_MODEL=base  # or small/medium for better accuracy
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# File Upload (adjust as needed)
MAX_UPLOAD_SIZE=524288000  # 500MB

# CORS (use your actual domain!)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend (.env)

```env
# Production API URL
VITE_API_URL=https://api.yourdomain.com
```

## Deployment Options

### Option 1: Docker Compose (Recommended for Small-Medium Scale)

```bash
# 1. Update docker-compose.yml for production
# 2. Set environment variables
# 3. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 4. Verify
docker-compose ps
curl https://api.yourdomain.com/health
```

### Option 2: Separate Services (Recommended for Large Scale)

**Backend:**
- Deploy on server with GPU (AWS EC2 g4dn, GCP with GPU, etc.)
- Use systemd or supervisor for process management
- Set up nginx as reverse proxy
- Configure SSL with Let's Encrypt

**Frontend:**
- Build: `npm run build`
- Deploy to CDN (Cloudflare, AWS CloudFront, etc.)
- Or serve with nginx

**Database:**
- Use managed PostgreSQL (AWS RDS, GCP Cloud SQL, etc.)
- Enable automated backups
- Set up read replicas if needed

**Vector Database:**
- Deploy Qdrant separately
- Consider Qdrant Cloud for managed service

## Post-Deployment

### ✅ Monitoring

- [ ] Set up application logging
- [ ] Monitor disk space usage
- [ ] Monitor memory usage
- [ ] Monitor API response times
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor database performance
- [ ] Track video processing times

### ✅ Backups

- [ ] Database backup schedule configured
- [ ] Video files backup strategy in place
- [ ] Test restore procedure
- [ ] Document backup locations

### ✅ Maintenance

- [ ] Update strategy planned
- [ ] Dependency update schedule
- [ ] Security patch process
- [ ] Model update procedure
- [ ] Database maintenance schedule

## Performance Optimization

### For Production Load

1. **Database Optimization**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_videos_status ON videos(status);
   CREATE INDEX idx_transcript_video_id ON transcripts(video_id);
   CREATE INDEX idx_frames_video_id ON frames(video_id);
   ```

2. **Caching Layer**
   - Consider Redis for caching API responses
   - Cache transcripts and analysis results
   - Cache search results

3. **Load Balancing**
   - Use nginx or HAProxy for load balancing
   - Scale backend horizontally
   - Use separate workers for video processing

4. **CDN**
   - Serve static assets from CDN
   - Cache video streams if possible
   - Use CDN for frontend

## Scaling Considerations

### Small Scale (1-100 videos/day)
- Single server with Docker Compose
- 4GB RAM, 2 CPU cores
- 100GB storage
- Whisper base model

### Medium Scale (100-1000 videos/day)
- Separate backend and database servers
- 8GB RAM, 4 CPU cores, GPU recommended
- 500GB storage
- Whisper small/medium model
- Consider job queue (Celery + Redis)

### Large Scale (1000+ videos/day)
- Kubernetes cluster
- Multiple backend workers
- Managed database with replicas
- Distributed file storage (S3, GCS)
- Job queue with multiple workers
- Load balancer
- CDN for video delivery
- Monitoring and alerting

## Security Hardening

### Production Security Checklist

- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Configure firewall rules
- [ ] Disable debug mode
- [ ] Set up fail2ban or similar
- [ ] Regular security updates
- [ ] Implement rate limiting
- [ ] Add authentication (if needed)
- [ ] Sanitize file uploads
- [ ] Validate all inputs
- [ ] Set up security headers

### Recommended nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Monitoring Setup

### Recommended Tools

1. **Application Monitoring**
   - Prometheus + Grafana
   - New Relic
   - DataDog

2. **Error Tracking**
   - Sentry
   - Rollbar

3. **Log Management**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Loki + Grafana
   - CloudWatch (AWS)

4. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

## Cost Estimation

### AWS Example (Medium Scale)

- EC2 g4dn.xlarge (GPU): ~$500/month
- RDS PostgreSQL db.t3.medium: ~$100/month
- S3 Storage (500GB): ~$12/month
- Data Transfer: ~$50/month
- **Total: ~$662/month**

### Self-Hosted Example

- VPS with GPU: ~$200-400/month
- Storage: Included or ~$20/month
- Bandwidth: Usually included
- **Total: ~$220-420/month**

## Launch Checklist

### Final Steps Before Going Live

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Backup system tested
- [ ] Monitoring configured
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Error pages customized
- [ ] Support email configured
- [ ] Terms of service added (if public)
- [ ] Privacy policy added (if public)

### Go Live!

```bash
# 1. Final backup
docker-compose exec db pg_dump -U user videodb > backup_pre_launch.sql

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d

# 3. Verify
curl https://api.yourdomain.com/health
curl https://yourdomain.com

# 4. Monitor logs
docker-compose logs -f

# 5. Test critical paths
# - Upload video
# - Process video
# - Search
# - Playback
```

## Rollback Plan

If something goes wrong:

```bash
# 1. Stop new deployment
docker-compose down

# 2. Restore previous version
git checkout <previous-commit>
docker-compose up -d

# 3. Restore database if needed
docker-compose exec -T db psql -U user videodb < backup_pre_launch.sql

# 4. Verify
curl https://api.yourdomain.com/health
```

---

**Ready for production?** Make sure all checkboxes are ticked! ✅
