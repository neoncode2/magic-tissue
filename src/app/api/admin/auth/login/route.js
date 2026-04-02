import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { setAdminSession, verifyPassword } from '@/lib/admin-auth';

export async function POST(request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await Admin.findOne({ username: String(username).trim().toLowerCase() });

    if (!admin) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    admin.lastLoginAt = new Date();
    await admin.save();
    await setAdminSession(admin);

    return Response.json({
      message: 'Login successful',
      admin: {
        id: admin._id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
      },
    });
  } catch (error) {
    return Response.json({ error: 'Login failed', details: error.message }, { status: 500 });
  }
}
