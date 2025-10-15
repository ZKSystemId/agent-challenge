// Mastra health check endpoint
import { createServer } from 'http';

const HEALTH_PORT = 4112; // Different port for health check

export function startHealthServer() {
  const server = createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        status: 'ok',
        service: 'mastra-agent',
        port: 4111,
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(HEALTH_PORT, () => {
    console.log(`Mastra health check running on port ${HEALTH_PORT}`);
  });

  return server;
}
