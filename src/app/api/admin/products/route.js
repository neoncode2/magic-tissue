import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json(products);
}

export async function POST(request) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const payload = await request.json();
    const product = await Product.create(payload);
    return Response.json(product, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
  }
}
