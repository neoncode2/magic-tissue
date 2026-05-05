import mongoose from 'mongoose';
import { getMongoUri } from '../config/env.mjs';

let connectionPromise = null;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(getMongoUri(), {
      dbName: process.env.MONGODB_DB_NAME?.trim() || 'magic-tissue',
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}
