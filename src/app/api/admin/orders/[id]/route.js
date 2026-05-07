import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
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
    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const nextStatus = updates?.status ?? existingOrder.status;
    const shouldDeductStock = existingOrder.status !== 'delivered' && nextStatus === 'delivered';

    if (shouldDeductStock) {
      const orderedQty = Math.max(1, Number(existingOrder.quantity || 1));
      const productName = String(existingOrder.productLabel || '').trim();
      let product = null;

      if (productName) {
        const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        product = await Product.findOne({ name: { $regex: `^${escapedName}$`, $options: 'i' } });
      }

      if (!product) {
        // Fallback for legacy orders where productLabel may not match product.name exactly.
        product = await Product.findOne().sort({ createdAt: 1 });
      }

      if (!product) {
        return Response.json(
          { error: `Stock product না পাওয়া গেছে: ${productName || 'Unnamed product'}` },
          { status: 400 }
        );
      }

      const currentStock = Math.max(0, Number(product.stockQuantity || 0));
      if (currentStock < orderedQty) {
        return Response.json(
          {
            error: `Insufficient stock. Available: ${currentStock}, required: ${orderedQty}`,
          },
          { status: 400 }
        );
      }

      product.stockQuantity = currentStock - orderedQty;
      product.inStock = product.stockQuantity > 0;
      await product.save();
    }

    const order = await Order.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

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
