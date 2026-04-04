function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildMongoUri() {
  const username = process.env.MONGODB_USERNAME?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const cluster = process.env.MONGODB_CLUSTER?.trim();
  const dbName = process.env.MONGODB_DB_NAME?.trim() || 'magic-tissue';
  const appName = process.env.MONGODB_APP_NAME?.trim() || 'Cluster0';

  if (!username || !password || !cluster) {
    return '';
  }

  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);

  return `mongodb+srv://${encodedUsername}:${encodedPassword}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=${encodeURIComponent(appName)}`;
}

function getMongoDebugInfo() {
  return {
    hasUri: Boolean(process.env.MONGODB_URI?.trim()),
    username: process.env.MONGODB_USERNAME?.trim() || null,
    cluster: process.env.MONGODB_CLUSTER?.trim() || null,
    dbName: process.env.MONGODB_DB_NAME?.trim() || 'magic-tissue',
    appName: process.env.MONGODB_APP_NAME?.trim() || 'Cluster0',
  };
}

function getMongoConfig() {
  const dbName = process.env.MONGODB_DB_NAME?.trim() || 'magic-tissue';
  const uri = process.env.MONGODB_URI?.trim() || buildMongoUri();

  return {
    uri: uri || getRequiredEnv('MONGODB_URI'),
    dbName,
  };
}

function getAdminSessionSecret() {
  const secret = getRequiredEnv('ADMIN_SESSION_SECRET');

  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters in production');
  }

  return secret;
}

function getMasterAdminKey() {
  const key = getRequiredEnv('MASTER_ADMIN_KEY');

  if (process.env.NODE_ENV === 'production' && key.length < 16) {
    throw new Error('MASTER_ADMIN_KEY must be at least 16 characters in production');
  }

  return key;
}

export { getAdminSessionSecret, getMasterAdminKey, getMongoConfig, getMongoDebugInfo, getRequiredEnv };
