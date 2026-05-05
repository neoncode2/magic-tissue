import { getFirebaseAdmin } from '../lib/firebase-admin.mjs';

export async function requireFirebaseUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ error: 'Missing Firebase token' });
  }

  try {
    const decoded = await getFirebaseAdmin().auth().verifyIdToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Firebase token', details: error.message });
  }
}
