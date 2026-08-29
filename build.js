const { execSync } = require('child_process');
const fs = require('fs');

if (fs.existsSync('frontend')) {
  console.log('--> Detected project root. Building frontend...');
  execSync('npm --prefix frontend install && npm --prefix frontend run build', { stdio: 'inherit' });

  // Copy frontend/dist to root/dist for Vercel
  if (fs.existsSync('frontend/dist')) {
    console.log('--> Mirroring frontend/dist to ./dist for Vercel...');
    fs.cpSync('frontend/dist', 'dist', { recursive: true });
  }
} else {
  console.log('--> Building inside frontend directory...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('--> Build finished successfully!');
