import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getAdminSession } from '@/lib/admin-auth';
import { getErrorMessage } from '@/lib/server-error';

export async function GET() {
  try {
    await dbConnect();
    const adminCount = await Admin.countDocuments();
    const session = await getAdminSession();

    if (!session?.id) {
      return Response.json({
        authenticated: false,
        adminCount,
        needsSetup: adminCount === 0,
      });
    }

    const admin = await Admin.findById(session.id).select('_id username displayName role').lean();

    if (!admin) {
      return Response.json({
        authenticated: false,
        adminCount,
        needsSetup: adminCount === 0,
      });
    }

    return Response.json({
      authenticated: true,
      adminCount,
      needsSetup: adminCount === 0,
      admin,
    });
  } catch (error) {
    return Response.json(
      {
        authenticated: false,
        adminCount: 0,
        needsSetup: false,
        error: 'Failed to load admin session',
        details: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined,
      },
      { status: 500 }
    );
  }
}
