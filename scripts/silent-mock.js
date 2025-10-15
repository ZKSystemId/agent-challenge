/**
 * Silent Mock Server - Runs quietly in background
 * No console output, just responds to health checks
 */

const http = require('http');
const PORT = 4111;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'mock' }));
  }
});

server.listen(PORT);
// Silent - no console output
