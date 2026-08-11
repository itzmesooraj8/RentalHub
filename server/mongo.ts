import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedMongoDatabase } from './seedMongo';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  if (!MONGODB_URI) {
    console.error('FATAL SECURITY ERROR: MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI environment variable is missing. Please set MONGODB_URI in your environment or .env file.');
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);

    // Ensure 2dsphere index is created for geospatial queries
    const { EquipmentModel } = await import('./models/Equipment');
    await EquipmentModel.createIndexes();

    // Auto-seed database if initial documents are empty
    await seedMongoDatabase();
  } catch (err: any) {
    console.error('MongoDB Atlas Connection Error:', err?.message || err);
    throw err;
  }
}
