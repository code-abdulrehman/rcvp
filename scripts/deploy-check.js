#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const config = {
  requiredFiles: [
    'docs/.vuepress/config.js',
    'docs/README.md',
    'package.json',
    'pnpm-lock.yaml'
  ],
  buildOutput: 'docs/.vuepress/dist',
  minBuildSize: 1024, // 1KB minimum
  maxBuildSize: 50 * 1024 * 1024 // 50MB maximum
};

function checkEnvironment() {
  console.log('🔍 Checking environment...');
  
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`Node.js version: ${nodeVersion}`);
  
  if (!nodeVersion.startsWith('v20')) {
    console.warn('⚠️  Node.js 20+ recommended for optimal performance');
  }
  
  // Check available memory
  const memUsage = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
  
  console.log('✅ Environment check passed');
}

function checkRequiredFiles() {
  console.log('📁 Checking required files...');
  
  for (const file of config.requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`✅ Found: ${file}`);
  }
  
  console.log('✅ All required files present');
}

function checkBuildOutput() {
  console.log('🏗️  Checking build output...');
  
  if (!fs.existsSync(config.buildOutput)) {
    console.error(`❌ Build output not found: ${config.buildOutput}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(config.buildOutput);
  let totalSize = 0;
  let fileCount = 0;
  
  for (const file of files) {
    const filePath = path.join(config.buildOutput, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
      fileCount++;
    }
  }
  
  console.log(`📊 Build statistics:`);
  console.log(`   Files: ${fileCount}`);
  console.log(`   Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalSize < config.minBuildSize) {
    console.error(`❌ Build output too small: ${totalSize} bytes`);
    process.exit(1);
  }
  
  if (totalSize > config.maxBuildSize) {
    console.warn(`⚠️  Build output very large: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Check for essential build files
  const essentialBuildFiles = ['index.html', 'assets'];
  for (const file of essentialBuildFiles) {
    const filePath = path.join(config.buildOutput, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Essential build file missing: ${file}`);
      process.exit(1);
    }
  }
  
  console.log('✅ Build output verified');
}

function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = packageJson.devDependencies || {};
    
    const requiredDeps = ['vuepress', '@vuepress/bundler-vite', 'vue'];
    for (const dep of requiredDeps) {
      if (!deps[dep]) {
        console.error(`❌ Required dependency missing: ${dep}`);
        process.exit(1);
      }
      console.log(`✅ Found: ${dep}@${deps[dep]}`);
    }
    
    console.log('✅ Dependencies check passed');
  } catch (error) {
    console.error('❌ Error reading package.json:', error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🚀 Starting deployment checks...\n');
  
  try {
    checkEnvironment();
    console.log('');
    
    checkRequiredFiles();
    console.log('');
    
    checkDependencies();
    console.log('');
    
    checkBuildOutput();
    console.log('');
    
    console.log('🎉 All checks passed! Deployment ready.');
  } catch (error) {
    console.error('❌ Deployment check failed:', error.message);
    process.exit(1);
  }
}

main(); 