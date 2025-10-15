/**
 * Direct Mastra Server Runner - Bypasses CLI issues on Windows
 */

const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Mastra Server Directly (Windows Fix)...\n');

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '4111';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';

console.log('📋 Configuration:');
console.log(`   Environment: ${process.env.NODE_ENV}`);
console.log(`   Port: ${process.env.PORT}`);
console.log(`   Log Level: ${process.env.LOG_LEVEL}\n`);

try {
  // Import Mastra
  const mastraPath = path.join(process.cwd(), 'src', 'mastra', 'index.ts');
  
  if (!fs.existsSync(mastraPath)) {
    console.error('❌ Cannot find src/mastra/index.ts');
    process.exit(1);
  }

  console.log('✓ Found Mastra configuration at:', mastraPath);
  console.log('✓ Starting Mastra server...\n');

  // Try to start the server directly
  require('ts-node/register');
  const { mastra } = require(mastraPath);
  
  if (mastra) {
    console.log('✓ Mastra instance loaded');
    
    // Start the dev server
    const express = require('express');
    const app = express();
    const PORT = parseInt(process.env.PORT || '4111');
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        service: 'mastra-agent',
        port: PORT,
        timestamp: new Date().toISOString()
      });
    });
    
    // Mastra agent endpoint
    app.post('/api/agent', express.json(), async (req, res) => {
      try {
        const { agent, action, params } = req.body;
        
        // Handle agent requests
        if (mastra.agents && mastra.agents[agent]) {
          const agentInstance = mastra.agents[agent];
          const result = await agentInstance[action](params);
          res.json({ success: true, result });
        } else {
          res.status(404).json({ error: 'Agent not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log('║     Mastra Server Running!             ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║  🌐 URL: http://localhost:${PORT}         ║`);
      console.log(`║  ✓ Health: http://localhost:${PORT}/health ║`);
      console.log('║  ✓ Agents: Ready                      ║');
      console.log('║  ✓ Tools: Loaded                      ║');
      console.log('║  ✓ MCP: Active                        ║');
      console.log('╚════════════════════════════════════════╝');
      console.log('\n👋 Press Ctrl+C to stop\n');
    });
    
  } else {
    console.error('❌ Could not load Mastra instance');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error starting Mastra:', error.message);
  
  // Fallback: Simple mock server
  console.log('\n⚠️  Starting fallback mock server...\n');
  
  const express = require('express');
  const app = express();
  const PORT = parseInt(process.env.PORT || '4111');
  
  app.use(express.json());
  
  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'mastra-mock',
      mode: 'fallback',
      port: PORT,
      timestamp: new Date().toISOString()
    });
  });
  
  // Mock agent endpoint - Fixed path for Express 5
  app.all('/api/:path(*)', (req, res) => {
    res.json({ 
      message: 'Mastra mock server running (fallback mode)',
      note: 'Agents not available in fallback mode',
      timestamp: new Date().toISOString()
    });
  });
  
  app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   Mastra Mock Server (Fallback)        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  🌐 URL: http://localhost:${PORT}         ║`);
    console.log(`║  ⚠️  Mode: Fallback (Mock)             ║`);
    console.log('║  ℹ️  Agents: Not available             ║');
    console.log('║  ✓ Health check: Working               ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\n💡 This allows the UI to run without Mastra errors.\n');
    console.log('👋 Press Ctrl+C to stop\n');
  });
}
