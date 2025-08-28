---
title: deployment
createTime: 2025/08/28 15:28:18
permalink: /article/pwop9sq2/
---
# Deployment

This guide covers deploying the React chatbot application to various platforms and environments.

## Overview

The chatbot application can be deployed to multiple platforms including Vercel, Netlify, AWS, and traditional hosting services.

## Build Process

### Production Build

```bash
# Install dependencies
npm install

# Create production build
npm run build

# The build output will be in the dist/ directory
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'clsx'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
```

## Environment Variables

### Production Environment

```env
# .env.production
VITE_OPENAI_API_KEY=your_production_api_key
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_MAX_TOKENS=1000
VITE_TEMPERATURE=0.7
VITE_APP_URL=https://your-domain.com
```

### Environment Validation

```typescript
// src/utils/env.ts
export const validateEnv = () => {
  const required = [
    'VITE_OPENAI_API_KEY',
    'VITE_OPENAI_MODEL',
    'VITE_MAX_TOKENS'
  ]

  const missing = required.filter(key => !import.meta.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
```

## Vercel Deployment

### Setup

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add your environment variables:
   - `VITE_OPENAI_API_KEY`
   - `VITE_OPENAI_MODEL`
   - `VITE_MAX_TOKENS`
   - `VITE_TEMPERATURE`

## Netlify Deployment

### Setup

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Netlify Configuration

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## AWS S3 + CloudFront

### S3 Setup

1. Create an S3 bucket:
```bash
aws s3 mb s3://your-chatbot-bucket
```

2. Configure bucket for static website hosting:
```bash
aws s3 website s3://your-chatbot-bucket --index-document index.html --error-document index.html
```

3. Upload build files:
```bash
aws s3 sync dist/ s3://your-chatbot-bucket --delete
```

### CloudFront Setup

1. Create CloudFront distribution
2. Set origin to your S3 bucket
3. Configure custom error pages to serve `index.html` for 404s

### AWS CLI Script

```bash
#!/bin/bash
# deploy.sh

BUCKET_NAME="your-chatbot-bucket"
DISTRIBUTION_ID="your-cloudfront-distribution-id"

echo "Building application..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
```

## Docker Deployment

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  chatbot:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## GitHub Actions CI/CD

### Workflow Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Security Considerations

### Content Security Policy

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com;
">
```

### Security Headers

```typescript
// server.js (for custom server)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})
```

## Performance Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html'
    })
  ]
})
```

### Compression

```typescript
// vite.config.ts
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
})
```

## Monitoring and Analytics

### Error Tracking

```typescript
// src/utils/errorTracking.ts
export const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // Send to your error tracking service
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Send to your error tracking service
  })
}
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const trackPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart)
      console.log('DOM content loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
    })
  }
}
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are prefixed with `VITE_`
   - Check platform-specific environment variable configuration

2. **Routing Issues**
   - Configure redirects to serve `index.html` for all routes
   - Ensure SPA routing is properly configured

3. **API Key Security**
   - Never expose API keys in client-side code
   - Use environment variables and server-side validation

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are properly installed

### Debug Commands

```bash
# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run preview

# Check bundle size
npm run build && npx vite-bundle-analyzer dist/

# Validate environment variables
node -e "console.log(process.env.VITE_OPENAI_API_KEY ? 'API Key found' : 'API Key missing')"
```

## Next Steps

After deployment, consider:

- [Testing](./testing.md) - Set up automated testing
- [Monitoring](./monitoring.md) - Monitor application performance
- [Scaling](./scaling.md) - Scale your application as needed 