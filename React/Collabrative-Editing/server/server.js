/**
 * Collaborative Diagram Editing Server
 * WebSocket server for real-time diagram synchronization
 * 
 * Features:
 * - Maintains current diagram state
 * - Broadcasts changes to all connected clients
 * - Handles client connections and disconnections
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Store the current diagram state
let diagramState = {
  nodes: [],
  connectors: [],
  timestamp: Date.now()
};

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('✅ New client connected. Total clients:', clients.size + 1);
  
  // Add client to set
  clients.add(ws);

  // Send current diagram state to new client
  ws.send(JSON.stringify({
    type: 'STATE_SYNC',
    payload: { state: diagramState },
    timestamp: Date.now()
  }));

  // Handle incoming messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📨 Received message type: ${message.type} from client ${message.clientId}`);

      switch (message.type) {
        case 'REQUEST_STATE':
          // Send current state to requesting client
          ws.send(JSON.stringify({
            type: 'STATE_SYNC',
            payload: { state: diagramState },
            timestamp: Date.now()
          }));
          break;

        case 'DIAGRAM_UPDATE':
          // Update server state
          diagramState = {
            ...message.payload.state,
            timestamp: Date.now()
          };

          // Broadcast to all OTHER clients
          broadcast(message, ws);
          break;

        case 'NODE_ADDED':
        case 'NODE_UPDATED':
        case 'NODE_DELETED':
        case 'CONNECTOR_ADDED':
        case 'CONNECTOR_UPDATED':
        case 'CONNECTOR_DELETED':
          // Broadcast specific changes
          broadcast(message, ws);
          break;

        default:
          console.log('⚠️ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔌 Client disconnected. Total clients:', clients.size);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });
});

/**
 * Broadcast message to all clients except sender
 */
function broadcast(message, sender) {
  let successCount = 0;
  let failCount = 0;

  clients.forEach((client) => {
    // Don't send back to sender
    if (client !== sender && client.readyState === 1) { // 1 = OPEN
      try {
        client.send(JSON.stringify(message));
        successCount++;
      } catch (error) {
        console.error('❌ Error broadcasting to client:', error);
        failCount++;
      }
    }
  });

  console.log(`📤 Broadcast complete: ${successCount} sent, ${failCount} failed`);
}

// REST API endpoints (optional)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: clients.size,
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Get current diagram state
app.get('/api/diagram', (req, res) => {
  res.json({
    state: diagramState,
    clients: clients.size
  });
});

// Reset diagram state
app.post('/api/diagram/reset', (req, res) => {
  diagramState = {
    nodes: [],
    connectors: [],
    timestamp: Date.now()
  };

  // Broadcast reset to all clients
  const resetMessage = {
    type: 'DIAGRAM_UPDATE',
    payload: { state: diagramState },
    timestamp: Date.now()
  };

  broadcast(resetMessage, null);

  res.json({
    success: true,
    message: 'Diagram reset successfully'
  });
});

// Start server
server.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Collaborative Diagram Editor Server                 ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║   HTTP Server:      http://localhost:${PORT}          ║`);
  console.log(`║   WebSocket Server: ws://localhost:${PORT}            ║`);
  console.log('║                                                       ║');
  console.log('║   Endpoints:                                          ║');
  console.log(`║   - GET  /health              Health check            ║`);
  console.log(`║   - GET  /api/diagram         Get current state       ║`);
  console.log(`║   - POST /api/diagram/reset   Reset diagram           ║`);
  console.log('╚═══════════════════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
