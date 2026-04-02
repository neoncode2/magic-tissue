import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdminApi, unauthorizedResponse } from '@/lib/admin-auth';

export async function PATCH(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const updates = await request.json();
    const product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    return Response.json({ error: 'Failed to update product', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const admin = await requireAdminApi(request);

  if (!admin) {
    return unauthorizedResponse();
  }

  await dbConnect();

  try {
    const { id } = await context.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({ message: 'Product deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete product', details: error.message }, { status: 500 });
  }
}
