#!/usr/bin/env node

/**
 * Custom Mastra dev runner for Windows compatibility
 * Handles the "Program Files" path issue
 */

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Mastra Development Server (Windows Compatible)...\n');

// Get Node.js path without spaces
function getNodePath() {
  try {
    // Get the short path name (8.3 format) to avoid spaces
    const nodePath = process.execPath;
    if (nodePath.includes('Program Files')) {
      // Try to get 8.3 short path
      try {
        const shortPath = execSync(`cmd /c for %A in ("${nodePath}") do @echo %~sA`, { encoding: 'utf8' }).trim();
        if (shortPath && !shortPath.includes(' ')) {
          console.log(`✓ Using short path for Node: ${shortPath}`);
          return shortPath;
        }
      } catch (e) {
        // Fallback: wrap in quotes
        return `"${nodePath}"`;
      }
    }
    return nodePath;
  } catch (error) {
    return process.execPath;
  }
}

// Find the mastra CLI
const possiblePaths = [
  path.join(process.cwd(), 'node_modules', '.bin', 'mastra.cmd'),
  path.join(process.cwd(), 'node_modules', '.bin', 'mastra'),
  path.join(process.cwd(), 'node_modules', '@mastra', 'cli', 'dist', 'index.js'),
  path.join(process.cwd(), 'node_modules', 'mastra', 'dist', 'cli.js'),
  path.join(process.cwd(), 'node_modules', 'mastra', 'cli.js'),
];

let mastraPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    mastraPath = p;
    console.log(`✓ Found Mastra at: ${p}`);
    break;
  }
}

if (!mastraPath) {
  console.error('❌ Could not find Mastra CLI. Please ensure @mastra/core is installed.');
  console.error('Run: pnpm install');
  process.exit(1);
}

// Determine how to run Mastra
let command, args;

if (mastraPath.endsWith('.cmd')) {
  // For .cmd files, read the content and extract the actual command
  const cmdContent = fs.readFileSync(mastraPath, 'utf8');
  
  // Try to extract the node command from the .cmd file
  const nodeMatch = cmdContent.match(/"([^"]+node[^"]*)".*"([^"]+)"/);
  if (nodeMatch) {
    // Use the extracted paths directly
    command = getNodePath();
    // Find the actual JS file to run
    const jsFile = path.join(process.cwd(), 'node_modules', 'mastra', 'dist', 'cli.js');
    if (fs.existsSync(jsFile)) {
      args = [jsFile, 'dev'];
    } else {
      // Fallback to the path in .cmd
      args = [nodeMatch[2], 'dev'];
    }
  } else {
    // Fallback: use cmd with quotes
    command = 'cmd.exe';
    args = ['/c', `"${mastraPath}"`, 'dev'];
  }
} else if (mastraPath.endsWith('.js')) {
  // Use node directly for .js files
  command = getNodePath();
  args = [mastraPath, 'dev'];
} else {
  // Try to run directly
  command = mastraPath;
  args = ['dev'];
}

console.log(`\n📦 Executing: ${command} ${args.join(' ')}\n`);

// Set environment variables
const env = {
  ...process.env,
  NODE_ENV: 'development',
  LOG_LEVEL: 'info',
  PORT: '4111',
};

// Spawn the process with proper handling
const child = spawn(command, args, {
  env,
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: false, // Don't use shell to avoid path issues
  windowsVerbatimArguments: true, // Windows-specific: preserve arguments exactly
});

child.on('error', (error) => {
  console.error('❌ Failed to start Mastra:', error.message);
  
  if (error.code === 'ENOENT') {
    console.error('\n💡 Suggestion: Try running with Node directly:');
    console.error(`   node ${mastraPath} dev`);
  }
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`\n⚠️ Mastra was terminated with signal: ${signal}`);
  } else if (code !== 0) {
    console.error(`\n❌ Mastra exited with code: ${code}`);
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Mastra dev server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
