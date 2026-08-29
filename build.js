const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--> Starting Vercel universal build process...');

// Check if running from root
if (fs.existsSync('frontend')) {
  console.log('--> Installing frontend dependencies...');
  execSync('npm --prefix frontend install', { stdio: 'inherit' });

  console.log('--> Compiling Vite frontend...');
  execSync('npm --prefix frontend run build', { stdio: 'inherit' });

  if (fs.existsSync('frontend/dist')) {
    console.log('--> Syncing build artifacts to ./dist...');
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
  }
} else {
  console.log('--> Compiling inside frontend folder...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('--> Vercel build completed successfully!');
