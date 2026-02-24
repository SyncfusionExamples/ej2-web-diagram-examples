import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index';
import layoutRoutes from './routes/layout.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:5173', 'http://localhost:5174']
}));

// Routes
app.use('/api', layoutRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Test database connection and start server
async function startServer(): Promise<void> {
  try {
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');

    app.listen(PORT, () => {
      console.log(`\n✓ Server is running on http://localhost:${PORT}`);
      console.log(`✓ API endpoint: http://localhost:${PORT}/api/layoutJS\n`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    console.error('Please ensure PostgreSQL is running and credentials in .env are correct');
    process.exit(1);
  }
}

startServer();
