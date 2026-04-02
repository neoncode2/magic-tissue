import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 });
  return Response.json(orders);
}
