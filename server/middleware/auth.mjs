export async function requireSpinUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');
  const spinUserId = String(token || '').trim();

  if (!spinUserId) {
    return res.status(401).json({ error: 'Missing spin session token' });
  }

  if (!/^spin-user-[a-zA-Z0-9-]+$/.test(spinUserId)) {
    return res.status(401).json({ error: 'Invalid spin session token' });
  }

  req.user = { uid: spinUserId };
  return next();
}
