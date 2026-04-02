import crypto from 'crypto';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

const SESSION_COOKIE_NAME = 'mt-admin-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'magic-tissue-admin-session-secret';
}

function getMasterKey() {
  return process.env.MASTER_ADMIN_KEY || 'magic-tissue-master-key';
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function safeCompare(left, right) {
  const leftHash = crypto.createHash('sha256').update(left).digest();
  const rightHash = crypto.createHash('sha256').update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key.toString('hex'));
    });
  });

  return `${salt}:${derivedKey}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, expected] = String(storedHash || '').split(':');

  if (!salt || !expected) {
    return false;
  }

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key.toString('hex'));
    });
  });

  return safeCompare(derivedKey, expected);
}

export function verifyMasterKey(masterKey) {
  if (!masterKey) {
    return false;
  }

  return safeCompare(masterKey, getMasterKey());
}

function createSessionToken(admin) {
  const payload = {
    id: String(admin._id),
    username: admin.username,
    displayName: admin.displayName || admin.username,
    role: admin.role || 'admin',
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token) {
  if (!token || !token.includes('.')) {
    return null;
  }

  const [encodedPayload, providedSignature] = token.split('.');

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!safeCompare(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload));

    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSession(admin) {
  const cookieStore = await cookies();
  const token = createSessionToken(admin);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return parseSessionToken(token);
}

export async function getAdminSessionFromRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return parseSessionToken(token);
}

export async function requireAdminApi(request) {
  const session = await getAdminSessionFromRequest(request);

  if (!session?.id) {
    return null;
  }

  await dbConnect();
  const admin = await Admin.findById(session.id).select('_id username displayName role').lean();
  return admin || null;
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ error: message }, { status: 401 });
}
