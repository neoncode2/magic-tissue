import dbConnect from '@/lib/mongodb';
import FAQ from '@/models/FAQ';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
  return Response.json(faqs);
}

export async function POST(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const payload = await request.json();
    const faq = await FAQ.create(payload);
    return Response.json(faq, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create FAQ', details: error.message }, { status: 500 });
  }
}
