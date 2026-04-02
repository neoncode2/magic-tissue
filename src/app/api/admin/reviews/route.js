import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  const reviews = await Review.find().sort({ createdAt: -1 });
  return Response.json(reviews);
}
