import { execSync } from 'child_process';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Initialize express app
const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Run Prisma migrations in development
if (process.env.NODE_ENV === "development") {
  console.log("🔄 Running Prisma migration to sync DB schema...");
  try {
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" });
  } catch (err) {
    console.error("❌ Failed to migrate schema:", err);
  }
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Error handling middleware
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Routes
import eventRoutes from './routes/events';
app.use('/api/events', eventRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'Backend is alive!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
});
