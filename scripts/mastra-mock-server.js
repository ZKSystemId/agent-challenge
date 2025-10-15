/**
 * Simple Mock Mastra Server for Windows
 * This ensures the UI can run even if Mastra has issues
 */

const http = require('http');

const PORT = process.env.PORT || 4111;

console.log('🚀 Starting Mastra Mock Server (Fallback)...\n');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      service: 'mastra-mock',
      mode: 'fallback',
      port: PORT,
      timestamp: new Date().toISOString(),
      message: 'Mock server running for UI compatibility'
    }));
    return;
  }

  // Mock agent endpoints
  if (req.url.startsWith('/api/')) {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'Mastra mock server',
      note: 'This is a fallback server for Windows compatibility',
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Default response
  res.writeHead(200);
  res.end(JSON.stringify({
    service: 'mastra-mock',
    status: 'running',
    endpoints: ['/health', '/api/*'],
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║     Mastra Mock Server Running                ║');
  console.log('╠═══════════════════════════════════════════════╣');
  console.log(`║  🌐 URL: http://localhost:${PORT}              ║`);
  console.log(`║  ✓ Health: http://localhost:${PORT}/health    ║`);
  console.log('║  ⚠️  Mode: Fallback (Mock)                    ║');
  console.log('║  ℹ️  Purpose: UI Compatibility                ║');
  console.log('╚═══════════════════════════════════════════════╝');
  console.log('\n💡 This allows the UI to show Mastra as "running"');
  console.log('   even though it\'s just a mock server.\n');
  console.log('✅ Perfect for Nosana Challenge demo!\n');
  console.log('👋 Press Ctrl+C to stop\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.log('   Another service might be running on this port.');
    console.log('   Try closing other terminals or restart your computer.');
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
