import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getMongoUri() {
  const direct = process.env.MONGODB_URI?.trim();

  if (direct) {
    return direct;
  }

  const username = process.env.MONGODB_USERNAME?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const cluster = process.env.MONGODB_CLUSTER?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || 'magic-tissue';
  const appName = process.env.MONGODB_APP_NAME?.trim() || 'Cluster0';

  if (!username || !password || !cluster) {
    throw new Error('Missing MongoDB connection variables');
  }

  return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=${encodeURIComponent(appName)}`;
}

export function getServerPort() {
  return Number(process.env.SPIN_SERVER_PORT || 4000);
}
