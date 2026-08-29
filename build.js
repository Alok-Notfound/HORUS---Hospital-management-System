const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--> Universal Vercel Build Starting...');

try {
  if (fs.existsSync('frontend') && fs.existsSync('frontend/package.json')) {
    console.log('--> Building from root directory...');
    execSync('npm --prefix frontend install', { stdio: 'inherit' });
    execSync('npm --prefix frontend run build', { stdio: 'inherit' });
    
    if (fs.existsSync('frontend/dist')) {
      console.log('--> Mirroring frontend/dist to root /dist...');
      fs.cpSync('frontend/dist', 'dist', { recursive: true });
    }
  } else {
    console.log('--> Building directly in current directory...');
    execSync('npm install', { stdio: 'inherit' });
    execSync('npm run build', { stdio: 'inherit' });
  }

  // Double check dist exists
  if (!fs.existsSync('dist') && fs.existsSync('frontend/dist')) {
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
  }

  console.log('--> Build SUCCESS: dist folder confirmed at', fs.existsSync('dist') ? './dist' : 'NOT FOUND');
} catch (err) {
  console.error('Build error:', err);
  process.exit(1);
}
