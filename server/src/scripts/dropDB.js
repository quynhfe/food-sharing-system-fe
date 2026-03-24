import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

dotenv.config();

const dropDB = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');
    
    const dbName = mongoose.connection.db.databaseName;
    console.log(`Dropping database: ${dbName}...`);
    
    await mongoose.connection.db.dropDatabase();
    
    console.log('Database dropped successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error dropping database:', error);
    process.exit(1);
  }
};

dropDB();
