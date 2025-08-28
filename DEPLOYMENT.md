# Deployment Troubleshooting Guide

This guide helps resolve common deployment issues with GitHub Pages.

## GitHub Pages Setup

### 1. Enable GitHub Pages

1. Go to your repository: `https://github.com/code-abdulrehman/rcvp`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### 2. Repository Settings

Make sure your repository has the following settings:

- **Repository is public** (or you have GitHub Pro for private repos)
- **GitHub Actions is enabled**
- **Pages is enabled** with GitHub Actions as source

### 3. Workflow Permissions

The workflow needs these permissions:

```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

## Common Issues and Solutions

### Issue 1: "Get Pages site failed"

**Error**: `Error: Get Pages site failed. Please verify that the repository has Pages enabled`

**Solution**:
1. Enable GitHub Pages in repository settings
2. Use the `enablement: true` parameter in the workflow
3. Make sure the repository is public

### Issue 2: Permission Denied

**Error**: `Permission to code-abdulrehman/rcvp.git denied`

**Solution**:
1. Check repository settings → Actions → General
2. Enable "Read and write permissions" for workflows
3. Make sure the workflow has proper permissions

### Issue 3: Lockfile Mismatch

**Error**: `ERR_PNPM_OUTDATED_LOCKFILE`

**Solution**:
1. Use `--no-frozen-lockfile` in the workflow
2. Or update lockfile locally and commit it

### Issue 4: Build Failures

**Error**: `crypto.hash is not a function`

**Solution**:
1. Use Node.js 20+ in the workflow
2. Use compatible VuePress versions
3. Clear cache and reinstall dependencies

## Alternative Deployment Methods

### Method 1: GitHub Actions (Recommended)

Use the main workflow file: `.github/workflows/deploy.yml`

### Method 2: Simple gh-pages Branch

Use the alternative workflow: `.github/workflows/deploy-simple.yml`

### Method 3: Manual Deployment

1. Build locally: `pnpm run docs:build`
2. Push to gh-pages branch manually

## Workflow Files

### Main Workflow (deploy.yml)
- Uses official GitHub Pages Actions
- Requires Pages to be enabled
- More modern approach

### Alternative Workflow (deploy-simple.yml)
- Uses peaceiris/actions-gh-pages
- Creates gh-pages branch
- More reliable for some setups

## Testing Deployment

### Local Testing
```bash
# Build the site
pnpm run docs:build

# Preview locally
pnpm run docs:preview
```

### CI/CD Testing
1. Push to main branch
2. Check Actions tab
3. Monitor build logs
4. Verify deployment

## Monitoring

### Check Deployment Status
1. Go to Actions tab in your repository
2. Look for the latest workflow run
3. Check the build and deploy steps
4. Look for any error messages

### Check Pages Status
1. Go to Settings → Pages
2. Check if the site is deployed
3. Note the site URL
4. Check for any error messages

## Rollback

If deployment fails:

1. **Revert the commit** that caused the issue
2. **Use a previous working version** of the workflow
3. **Check the logs** for specific error messages
4. **Try the alternative workflow** if needed

## Support

If you continue to have issues:

1. Check the GitHub Actions logs for specific errors
2. Verify all repository settings
3. Try the alternative deployment method
4. Check GitHub Pages documentation 