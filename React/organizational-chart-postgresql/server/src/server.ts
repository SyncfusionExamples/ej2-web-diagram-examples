import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/index.js';
import layoutRoutes from './routes/layout.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// Middleware: Enable CORS for React frontend
// Allows requests from Vite dev server (ports 5173, 5174)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Register API routes with /api prefix
// All routes from `layoutRoutes` will be accessible at /api/*
app.use('/api', layoutRoutes);

// 404 Handler: Catch all undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler: Catch any unhandled errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start the Express server
 * First tests database connectivity, then starts HTTP server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection before starting server
    await pool.query('SELECT NOW()');
    console.log('✓ Database connected successfully');
    
    // Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api/layout`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);  // Exit with error code
  }
};

startServer();