import { clearAdminSession } from '@/lib/admin-auth';

export async function POST() {
  await clearAdminSession();
  return Response.json({ message: 'Logged out' });
}
