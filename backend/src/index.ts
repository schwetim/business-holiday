import { execSync } from 'child_process';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

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
import accommodationRoutes from './routes/accommodations'; // Import accommodation routes
app.use('/api/events', eventRoutes);
app.use('/api/accommodations', accommodationRoutes); // Use accommodation routes

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'Backend is alive!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});
