#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const distPath = 'docs/.vuepress/dist';

function checkBuildOutput() {
  console.log('🔍 Checking build output...');
  
  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ Build output directory does not exist');
    process.exit(1);
  }
  
  // Check for essential files
  const essentialFiles = [
    'index.html',
    'assets/',
    '.vuepress/dist/'
  ];
  
  for (const file of essentialFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Essential file missing: ${file}`);
      process.exit(1);
    }
  }
  
  // Check file sizes
  const files = fs.readdirSync(distPath);
  let totalSize = 0;
  
  for (const file of files) {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      totalSize += stats.size;
    }
  }
  
  console.log(`✅ Build output verified`);
  console.log(`📁 Total files: ${files.length}`);
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalSize < 1024) {
    console.warn('⚠️  Build output seems too small, might be incomplete');
  }
  
  console.log('🎉 Health check passed!');
}

checkBuildOutput(); 