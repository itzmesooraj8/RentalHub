import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedMongoDatabase } from './seedMongo';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://brokeinside06_db_user:sooraj2006@rentalhub.y4y3bl8.mongodb.net/rentalhub?retryWrites=true&w=majority';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed database if initial documents are empty
    await seedMongoDatabase();
  } catch (err: any) {
    console.error('MongoDB Atlas Connection Error:', err?.message || err);
    console.warn('Falling back to local simulation mode if MongoDB Atlas is unreachable.');
  }
}
