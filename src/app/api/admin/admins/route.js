import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import {
  hashPassword,
  requireAdminApi,
  unauthorizedResponse,
  verifyMasterKey,
} from '@/lib/admin-auth';
import { serverErrorResponse } from '@/lib/server-error';

export async function GET(request) {
  try {
    const admin = await requireAdminApi(request);

    if (!admin) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const admins = await Admin.find().select('_id username displayName role createdAt lastLoginAt').sort({ createdAt: -1 });
    return Response.json(admins);
  } catch (error) {
    return serverErrorResponse('Failed to load admins', error);
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { username, password, displayName, masterKey } = await request.json();

    if (!verifyMasterKey(masterKey)) {
      return Response.json({ error: 'Master key is invalid' }, { status: 401 });
    }

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const normalizedUsername = String(username).trim().toLowerCase();
    const exists = await Admin.findOne({ username: normalizedUsername });

    if (exists) {
      return Response.json({ error: 'Username already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const admin = await Admin.create({
      username: normalizedUsername,
      displayName: displayName || normalizedUsername,
      passwordHash,
      role: 'admin',
    });

    return Response.json(
      {
        message: 'Admin created successfully',
        admin: {
          id: admin._id,
          username: admin.username,
          displayName: admin.displayName,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return serverErrorResponse('Failed to create admin', error);
  }
}
