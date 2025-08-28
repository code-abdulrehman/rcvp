# Deployment Guide

This guide covers the deployment process for the React Chatbot documentation site.

## Overview

The site is deployed using GitHub Actions to GitHub Pages. The deployment process includes:

- ✅ Environment checks
- ✅ Dependency verification
- ✅ Build process
- ✅ Health checks
- ✅ Automatic deployment

## Deployment Process

### 1. Automatic Deployment

The site automatically deploys when:
- Code is pushed to the `main` branch
- A pull request is created against `main`
- Manual trigger via GitHub Actions

### 2. Deployment Steps

1. **Test Job**: Verifies environment and dependencies
2. **Build Job**: Creates production build with health checks
3. **Deploy Job**: Deploys to GitHub Pages

### 3. Health Checks

The deployment includes comprehensive health checks:

- ✅ Node.js version verification
- ✅ Dependency installation
- ✅ Build output validation
- ✅ File size and count verification
- ✅ Essential files presence check

## Troubleshooting

### Common Issues

#### 1. Lockfile Mismatch
```bash
# Solution: Update lockfile locally
./update-deps.sh
git add pnpm-lock.yaml
git commit -m "Update lockfile"
git push origin main
```

#### 2. Build Failures
```bash
# Check build locally
pnpm run docs:full-check

# Clean and rebuild
rm -rf node_modules
pnpm install
pnpm run docs:build
```

#### 3. Dependency Issues
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install --no-frozen-lockfile
```

### Manual Deployment

If automatic deployment fails, you can deploy manually:

1. **Local Build**:
   ```bash
   pnpm run docs:full-check
   ```

2. **Manual Upload**:
   - Go to repository Settings → Pages
   - Upload the `docs/.vuepress/dist` folder

### Fallback Deployment

If the main deployment fails, a fallback workflow will:
- Use npm instead of pnpm
- Use Node.js 18 instead of 20
- Attempt alternative build methods

## Monitoring

### Check Deployment Status

1. **GitHub Actions Tab**: Monitor workflow runs
2. **Pages Tab**: Check deployment status
3. **Site URL**: Verify live site functionality

### Logs and Debugging

- Check workflow logs in GitHub Actions
- Use `pnpm run docs:deploy-check` for local verification
- Review build output in `docs/.vuepress/dist/`

## Performance Optimization

### Build Optimization

- Uses pnpm for faster dependency installation
- Implements caching for faster builds
- Includes health checks to prevent broken deployments

### Site Optimization

- VuePress optimizations enabled
- Asset compression
- CDN delivery via GitHub Pages

## Security

### Environment Variables

- No sensitive data in build process
- API keys handled securely
- Public deployment only

### Dependencies

- Regular dependency updates
- Security scanning enabled
- Locked dependency versions

## Support

If deployment issues persist:

1. Check the [GitHub Actions logs](https://github.com/code-abdulrehman/rcvp/actions)
2. Review this deployment guide
3. Check the [VuePress documentation](https://v2.vuepress.vuejs.org/)
4. Open an issue in the repository

## Quick Commands

```bash
# Full deployment check
pnpm run docs:full-check

# Build only
pnpm run docs:build

# Health check only
pnpm run docs:health-check

# Development server
pnpm run docs:dev

# Update dependencies
./update-deps.sh
``` 