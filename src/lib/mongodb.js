import mongoose from 'mongoose';
import { getMongoConfig } from '@/lib/env';

let cached = global.__mongooseCache;

if (!cached) {
  cached = global.__mongooseCache = {
    conn: null,
    promise: null,
    uri: null,
  };
}

async function dbConnect() {
  const { uri, dbName } = getMongoConfig();

  if (cached.uri && cached.uri !== uri) {
    cached.conn = null;
    cached.promise = null;
  }

  cached.uri = uri;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
    };

    cached.promise = mongoose.connect(uri, opts).then((instance) => instance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
