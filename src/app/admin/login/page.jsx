import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLogin from '@/components/admin/AdminLogin';

export const metadata = {
  title: 'Admin Login | Magic Tissue',
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session?.id) {
    redirect('/admin');
  }

  let adminCount = null;
  let dbError = '';

  try {
    await dbConnect();
    adminCount = await Admin.countDocuments();
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Database connection failed';
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.16),transparent_35%),#070707]">
      <AdminLogin needsSetup={adminCount === 0} dbError={dbError} />
    </main>
  );
}
