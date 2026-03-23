import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { startExpirationJob } from './jobs/expirationJob.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start automated jobs
  startExpirationJob();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

