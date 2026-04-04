import { clearAdminSession } from '@/lib/admin-auth';
import { serverErrorResponse } from '@/lib/server-error';

export async function POST() {
  try {
    await clearAdminSession();
    return Response.json({ message: 'Logged out' });
  } catch (error) {
    return serverErrorResponse('Logout failed', error);
  }
}
