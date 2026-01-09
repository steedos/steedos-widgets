#!/usr/bin/env node

/**
 * Development server that combines unpkg local server with watch mode
 * This provides a better development experience by:
 * 1. Serving packages locally via unpkg-compatible server
 * 2. Automatically rebuilding packages when source files change
 * 3. Providing live reload capabilities
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

function parsePackagePath(urlPath) {
  // Remove leading '/'
  const parts = urlPath.slice(1).split('/');
  let packageName, version, filePath;

  if (parts[0].startsWith('@')) {
    // Scoped package
    const scopedName = parts.slice(0, 2).join('/');

    // Check if there's a version after the package name
    const secondAtIndex = scopedName.indexOf('@', 1);
    if (secondAtIndex !== -1) {
      packageName = scopedName.slice(0, secondAtIndex);
      version = scopedName.slice(secondAtIndex + 1);
    } else {
      packageName = scopedName;
      version = null;
    }
    filePath = parts.slice(2).join('/');
  } else {
    // Regular package
    const atIndex = parts[0].lastIndexOf('@');
    if (atIndex !== -1) {
      packageName = parts[0].slice(0, atIndex);
      version = parts[0].slice(atIndex + 1);
    } else {
      packageName = parts[0];
      version = null;
    }
    filePath = parts.slice(1).join('/');
  }

  return { packageName, version, filePath };
}

// Handle requests
app.get('/*', (req, res) => {
  const { packageName, version, filePath } = parsePackagePath(req.path);

  try {
    if (!packageName) {
      return res.status(400).send('Invalid package name');
    }
    
    const packageMainPath = require.resolve(`${packageName}/package.json`);
    const packageDir = path.dirname(packageMainPath);

    // If no file path specified, return package.json
    const targetFile = filePath || 'package.json';
    const fullPath = path.join(packageDir, targetFile);

    // Prevent path traversal attacks
    if (!fullPath.startsWith(packageDir)) {
      return res.status(400).send('Invalid path');
    }

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send('File not found');
    }

    res.sendFile(fullPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start watch mode for packages
let watchProcess = null;

function startWatch() {
  console.log('\n🔄 Starting watch mode for packages...\n');
  
  watchProcess = spawn('yarn', ['watch'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  watchProcess.on('error', (error) => {
    console.error('❌ Watch process error:', error);
  });

  watchProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.log(`⚠️  Watch process exited with code ${code}`);
    }
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  🚀 Steedos Widgets Development Server Started                ║
║                                                                ║
║  📦 Unpkg Server: http://localhost:${PORT}                      ║
║  👀 Watch Mode: Active (auto-rebuild on file changes)         ║
║                                                                ║
║  📝 Usage:                                                     ║
║  Set STEEDOS_PUBLIC_PAGE_ASSETURLS in your Steedos project:   ║
║  http://127.0.0.1:${PORT}/@steedos-widgets/amis-object/dist/assets-dev.json
║                                                                ║
║  💡 Tips:                                                      ║
║  - Files are automatically rebuilt when you save changes      ║
║  - Check console for build status                             ║
║  - Press Ctrl+C to stop the server                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
  
  // Start watch mode
  startWatch();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Shutting down development server...');
  if (watchProcess) {
    watchProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Shutting down development server...');
  if (watchProcess) {
    watchProcess.kill('SIGTERM');
  }
  process.exit(0);
});
