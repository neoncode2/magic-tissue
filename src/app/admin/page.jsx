import { redirect } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getAdminSession } from '@/lib/admin-auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Dashboard | Magic Tissue',
};

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session?.id) {
    redirect('/admin/login');
  }

  await dbConnect();
  const admin = await Admin.findById(session.id).select('_id username displayName role').lean();

  if (!admin) {
    redirect('/admin/login');
  }

  return <AdminDashboard admin={JSON.parse(JSON.stringify(admin))} />;
}
