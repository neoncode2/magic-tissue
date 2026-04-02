import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
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
    const order = await Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
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
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({ message: 'Order deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete order', details: error.message }, { status: 500 });
  }
}
